/// <reference types="./custom_typings/@sabaki/influence" />
/// <reference types="./custom_typings/@sabaki/sgf" />
/// <reference types="./custom_typings/@sabaki/immutable-gametree" />
import Board, { Sign, Vertex } from "@sabaki/go-board";
import influence from "@sabaki/influence";
import { Response } from "../api/base";
import {
  Color,
  GamePhase,
  GameState,
  IInitializeRequest,
  IJoinGameRequest,
  ILeaveGameRequest,
  IMakeMoveRequest,
  IPassRequest,
  IPickColorRequest,
  ISetBoardSizeRequest,
  IUndoRequest,
  Move,
  Player,
  Total,
  UserId,
} from "../api/types";
import { Context, Methods } from "./.hathora/methods";
import * as sabakiDeadstones from "./deadstones/js/main";
import { isPass, Pass } from "./pass";
import { moveHistoryToSgf } from "./sgf";

type InternalState = {
  createdBy: UserId | undefined;
  phase: GamePhase;
  board: Board;
  history: (Board | Pass)[];
  turn: Color;
  players: Player[];
  undoRequested: UserId | undefined;
  lastMove: Move | undefined;
  deadStonesMap: Vertex[] | undefined;
  moveHistory: { color: Color; move: Move | "pass" }[];
};

function checkTurn(state: InternalState, playerColor: Color): Response {
  if (state.phase === GamePhase.Ended) {
    return Response.error("Game has ended.");
  }
  if (state.turn === Color.None) {
    // shouldn't happen
    return Response.error("Internal server error.");
  }
  if (playerColor === Color.None) {
    return Response.error("Player has not been assigned a color.");
  }
  if (playerColor !== state.turn) {
    return Response.error("It's not the player's turn.");
  }
  return Response.ok();
}

export class Impl implements Methods<InternalState> {
  initialize(ctx: Context, request: IInitializeRequest): InternalState {
    return {
      createdBy: undefined,
      phase: GamePhase.NotStarted,
      board: Board.fromDimensions(9),
      history: [],
      turn: Color.Black,
      players: [],
      undoRequested: undefined,
      lastMove: undefined,
      deadStonesMap: undefined,
      moveHistory: [],
    };
  }
  joinGame(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IJoinGameRequest
  ): Response {
    if (state.players.length === 2) {
      return Response.error("Game already has two players.");
    }
    const playerJoined = state.players.find((player) => player.id === userId);
    if (playerJoined != null) {
      return Response.error("Player has already joined this game.");
    }
    if (state.createdBy === undefined) {
      state.createdBy = userId;
    }
    let color = Color.None;
    const oponent = state.players.find((player) => player.id !== userId);
    if (oponent != null) {
      if (oponent.color === Color.Black) {
        color = Color.White;
      } else if (oponent.color === Color.White) {
        color = Color.Black;
      }
    }
    state.players.push({ id: userId, color });
    return Response.ok();
  }
  leaveGame(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: ILeaveGameRequest
  ): Response {
    const playerLeaving = state.players.find((player) => player.id === userId);
    if (playerLeaving == null) {
      return Response.error("Player is not in this game.");
    }
    state.players = state.players.filter((player) => player.id !== userId);
    return Response.ok();
  }
  setBoardSize(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: ISetBoardSizeRequest
  ) {
    const player = state.players.find((player) => player.id === userId);
    if (player == null) {
      return Response.error("Player is not in this game.");
    }
    if (state.phase !== GamePhase.NotStarted) {
      return Response.error(
        "Can only change board size if game has not started."
      );
    }
    if (request.size > 19) {
      return Response.error(`Maximum board size is 19, got ${request.size}.`);
    }
    if (request.size < 1) {
      return Response.error(`Minimum board size is 1, got ${request.size}.`);
    }
    state.board = Board.fromDimensions(request.size);
    return Response.ok();
  }
  pickColor(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IPickColorRequest
  ): Response {
    const player = state.players.find((player) => player.id === userId);
    if (player == null) {
      return Response.error("Player is not in this game.");
    }
    if (state.phase !== GamePhase.NotStarted) {
      return Response.error("Can only pick color if game has not started.");
    }
    const oponent = state.players.find((player) => player.id !== userId);
    if (
      request.color !== Color.None &&
      oponent != null &&
      oponent.color !== Color.None
    ) {
      return Response.error("Can not change color once oponent has as color.");
    }
    player.color = request.color;
    if (oponent != null) {
      if (player.color === Color.Black) {
        oponent.color = Color.White;
      } else if (player.color === Color.White) {
        oponent.color = Color.Black;
      }
    }
    return Response.ok();
  }
  makeMove(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IMakeMoveRequest
  ): Response {
    const player = state.players.find((player) => player.id === userId);
    if (player == null) {
      return Response.error("Player is not in this game.");
    }
    const response = checkTurn(state, player.color);
    if (response.type === "error") {
      return response;
    }
    const sign = player.color === Color.White ? -1 : 1;
    const vertex: Vertex = [request.x, request.y];
    const { pass, overwrite, ko, suicide } = state.board.analyzeMove(
      sign,
      vertex
    );
    if (pass) {
      return Response.error("Move is outside the board.");
    }
    if (overwrite) {
      return Response.error("Move is on an existing stone.");
    }
    if (ko) {
      return Response.error("Move violates Ko rule.");
    }
    if (suicide) {
      return Response.error("Move is suicide.");
    }
    try {
      const newBoard = state.board.makeMove(sign, vertex, {
        preventOverwrite: true,
        preventSuicide: true,
        preventKo: true,
      });
      state.history.push(state.board);
      state.moveHistory.push({ color: player.color, move: request });
      state.board = newBoard;
      state.turn = player.color === Color.White ? Color.Black : Color.White;
      state.phase = GamePhase.InProgress;
      state.lastMove = request;
      state.undoRequested = undefined;
      return Response.ok();
    } catch (e: any) {
      return Response.error(e.toString());
    }
  }
  pass(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IPassRequest
  ): Response {
    const player = state.players.find((player) => player.id === userId);
    if (player == null) {
      return Response.error("Player is not in this game.");
    }
    const response = checkTurn(state, player.color);
    if (response.type === "error") {
      return response;
    }
    state.history.push({ type: "pass", color: player.color });
    state.moveHistory.push({ color: player.color, move: "pass" });
    state.turn = player.color === Color.White ? Color.Black : Color.White;
    state.phase = GamePhase.InProgress;
    // if there were two passes in a row, and the player passing now is playing
    // white then end the game (white always gets the last pass)
    if (
      player.color === Color.White &&
      state.history.length >= 2 &&
      isPass(state.history[state.history.length - 2])
    ) {
      state.phase = GamePhase.Ended;
      // this is not great since the promise makes race conditions on
      // state.deadStonesMap possible (but they are still unlikely to occur)
      sabakiDeadstones
        .guess(state.board.signMap, {
          finished: true,
        })
        .then((deadStonesMap) => {
          state.deadStonesMap = deadStonesMap;
        });
    }
    return Response.ok();
  }
  undo(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IUndoRequest
  ): Response {
    const player = state.players.find((player) => player.id === userId);
    if (player == null) {
      return Response.error("Player is not in this game.");
    }
    const lastTurn = state.history[state.history.length - 1];
    if (lastTurn == null) {
      return Response.error("Nothing to undo.");
    }
    // the request from the first player is recorded
    if (state.players.length === 2 && state.undoRequested === undefined) {
      state.undoRequested = player.id;
      return Response.ok();
    }
    if (state.undoRequested === userId) {
      return Response.error("Undo already requested.");
    }
    // when the second player requests undo it's a confirmation and we perform
    // the undo
    if (isPass(lastTurn)) {
      state.turn = lastTurn.color;
    } else {
      // if it wasn't a pass it get's a bit more complicated to restore the
      // "lastMove" marker especially in the case when a pass (or multiple
      // passes) is followed by a move (followed by the undo we are
      // performing). we have to find the previous actual stone placed, so have
      // to skip all passes. we look at a max of three turns (since three
      // passes in a row would mean the game ended guaranteed, so couldn't have
      // happened) we check for passes and restore the lastMove marker to the
      // first non-pass move within that
      const moveBeforeLast = state.history
        .slice(-4, -1)
        .filter((m) => !isPass(m))
        .pop();
      if (moveBeforeLast == null) {
        // it must have been the start of the game, remove the lastMove marker
        state.lastMove = undefined;
      } else {
        // if we have a move use a diff to establish the lastMove marker
        const diffVerteces = lastTurn.diff(moveBeforeLast as Board);
        state.lastMove = { x: diffVerteces![0][0], y: diffVerteces![0][1] };
      }
      state.turn = state.turn === Color.White ? Color.Black : Color.White;
      state.board = lastTurn;
    }
    // actually undo
    state.history.pop();
    state.moveHistory.pop();
    state.undoRequested = undefined;
    if (state.history.length === 0) {
      state.phase = GamePhase.NotStarted;
    } else {
      state.phase = GamePhase.InProgress;
    }
    return Response.ok();
  }
  rejectUndo(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IUndoRequest
  ): Response {
    state.undoRequested = undefined;
    return Response.ok();
  }
  getUserState(state: InternalState, userId: UserId): GameState {
    const lastMove = state.history[state.history.length - 1];
    const moveBeforeLast = state.history[state.history.length - 2];
    const threeMovesAgo = state.history[state.history.length - 3];
    const passes = [];
    if (isPass(lastMove)) {
      passes.push(lastMove);
      if (isPass(moveBeforeLast)) {
        passes.push(moveBeforeLast);
        if (isPass(threeMovesAgo)) {
          passes.push(threeMovesAgo);
        }
      }
    }
    let captures = {
      black: state.board.getCaptures(1),
      white: state.board.getCaptures(-1),
    };
    let deadStones = {
      black: 0,
      white: 0,
    };
    let score;
    if (state.deadStonesMap) {
      const board = state.board.clone();
      for (const vertex of state.deadStonesMap) {
        const sign = board.get(vertex);
        if (sign === 1) {
          captures.white += 1;
          deadStones.white += 1;
        } else if (sign === -1) {
          captures.black += 1;
          deadStones.black += 1;
        }
        board.set(vertex, 0);
      }
      board.setCaptures(1, captures.black);
      board.setCaptures(-1, captures.white);
      const areaMap = influence.areaMap(board.signMap);
      score = getScore(board, areaMap, deadStones, { komi: 6.5 });
    }
    return {
      createdBy: state.createdBy,
      phase: state.phase,
      signMap: state.board.signMap,
      captures,
      turn: state.turn,
      turnNumber: state.history.length,
      players: state.players,
      undoRequested: state.undoRequested,
      lastMove: state.lastMove,
      passes: passes.map(({ color }) => color),
      deadStonesMap: state.deadStonesMap,
      sgf: moveHistoryToSgf(state.moveHistory, state.board.width),
      score,
    };
  }
}

function getScore(
  board: Board,
  areaMap: Sign[][],
  deadStones: Total,
  { komi = 6.5, handicap = 0 } = {}
) {
  const score = {
    area: { black: 0, white: 0 },
    territory: { black: 0, white: 0 },
    captures: { black: board.getCaptures(1), white: board.getCaptures(-1) },
    areaScore: 0,
    territoryScore: 0,
    deadStones,
    winner: Color.None,
  };

  for (let x = 0; x < board.width; x++) {
    for (let y = 0; y < board.height; y++) {
      const z = areaMap[y][x];
      const color = z > 0 ? "black" : "white";

      score.area[color] += Math.abs(Math.sign(z));
      if (board.get([x, y]) === 0) {
        score.territory[color] += Math.abs(Math.sign(z));
      }
    }
  }

  score.area = {
    black: Math.round(score.area.black),
    white: Math.round(score.area.white),
  };
  score.territory = {
    black: Math.round(score.territory.black),
    white: Math.round(score.territory.white),
  };

  score.areaScore = score.area.black - score.area.white - komi - handicap;
  score.territoryScore =
    score.territory.black -
    score.territory.white +
    score.captures.black -
    score.captures.white -
    komi;

  if (score.areaScore < 0 && score.territoryScore < 0) {
    score.winner = Color.White;
  } else if (score.areaScore > 0 && score.territoryScore > 0) {
    score.winner = Color.Black;
  }

  return score;
}
