import Board, { Vertex } from "@sabaki/go-board";
import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  Color,
  Player,
  Move,
  GamePhase,
  GameState,
  UserId,
  IJoinGameRequest,
  ILeaveGameRequest,
  ISetBoardSizeRequest,
  IPickColorRequest,
  IMakeMoveRequest,
  IPassRequest,
  IUndoRequest,
} from "../api/types";

type Pass = { type: "pass"; color: Color };

function isPass(obj: any): obj is Pass {
  return obj != null && obj.type === "pass";
}

type InternalState = {
  phase: GamePhase;
  board: Board;
  history: (Board | Pass)[];
  turn: Color;
  players: Player[];
  undoRequested: UserId | undefined;
  lastMove: Move | undefined;
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
  initialize(userId: UserId, ctx: Context): InternalState {
    return {
      phase: GamePhase.NotStarted,
      board: Board.fromDimensions(9),
      history: [],
      turn: Color.Black,
      players: [{ id: userId, color: Color.None }],
      undoRequested: undefined,
      lastMove: undefined,
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
    state.turn = player.color === Color.White ? Color.Black : Color.White;
    // if that last two actions were passes, and the player passing is playing
    // white then end the game (white always gets the last pass)
    if (
      player.color === Color.White &&
      state.history.length >= 2 &&
      isPass(state.history[state.history.length - 2])
    ) {
      state.phase = GamePhase.Ended;
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
      // if it wasn't a pass it get's a bit more complicated to restore the "lastMove" marker
      // especially in the case when a pass (or multiple passes) is followed by a move (followed by the undo we are performing).
      // we have to find the previous actual stone placed, so have to skip all passes.
      // we look at a max of three turns (since three passes in a row would mean the game ended, so couldn't have happened)
      // we check for passes and restore the lastMove marker to the first non-pass move within that
      const threeTurns = state.history.slice(-4, -1);
      let beforeLastTurn = threeTurns.pop();
      // keep looking for a move that wasn't a pass
      while (beforeLastTurn != null && isPass(beforeLastTurn)) {
        beforeLastTurn = threeTurns.pop();
      }
      if (beforeLastTurn == null) {
        // if it was the start of the move remove the lastMove marker
        state.lastMove = undefined;
      } else {
        // if we have a move use the diff to establish the lastMove marker
        const diffVerteces = lastTurn.diff(beforeLastTurn as Board);
        state.lastMove = { x: diffVerteces![0][0], y: diffVerteces![0][1] };
      }
      state.turn = state.turn === Color.White ? Color.Black : Color.White;
      state.board = lastTurn;
    }
    // actually undo
    state.history.pop();
    state.undoRequested = undefined;
    if (state.history.length === 0) {
      state.phase = GamePhase.NotStarted;
    } else {
      state.phase = GamePhase.InProgress;
    }
    return Response.ok();
  }
  getUserState(state: InternalState, userId: UserId): GameState {
    return {
      phase: state.phase,
      signMap: state.board.signMap,
      captures: {
        black: state.board.getCaptures(1),
        white: state.board.getCaptures(-1),
      },
      turn: state.turn,
      players: state.players,
      undoRequested: state.undoRequested,
      lastMove: state.lastMove,
    };
  }
}
