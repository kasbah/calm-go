import Board, { Vertex } from "@sabaki/go-board";
import { Methods, Context } from "./.hathora/methods";
import { Response } from "../api/base";
import {
  Color,
  Player,
  GameState,
  UserId,
  IJoinGameRequest,
  IPickColorRequest,
  IMakeMoveRequest,
  IPassRequest,
  IUndoRequest,
} from "../api/types";

type Pass = { type: "pass"; color: Color };

function isPass(obj: any): obj is Pass {
  return obj.type === "pass";
}

type InternalState = {
  board: Board;
  history: (Board | Pass)[];
  turn: Color;
  players: Player[];
  undoRequested: UserId | undefined;
};

function checkTurn(state: InternalState, playerColor: Color): Response {
  if (state.turn === Color.None) {
    return Response.error("Game is not active.");
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
      board: Board.fromDimensions(9, 9),
      history: [],
      turn: Color.Black,
      players: [],
      undoRequested: undefined,
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
  pickColor(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IPickColorRequest
  ): Response {
    const player = state.players.find((player) => player.id === userId);
    const oponent = state.players.find((player) => player.id !== userId);
    if (player == null) {
      return Response.error("Player is not in this game.");
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
    const vertex: Vertex = [request.move.x, request.move.y];
    const {pass, overwrite, ko} = state.board.analyzeMove(sign, vertex);
    if (pass) {
      return Response.error("Move is outside the board.")
    }
    if (overwrite) {
      return Response.error("Move is on an existing stone.")
    }
    if (ko) {
      return Response.error("Move violates Ko rule.")
    }
    try {
      const newBoard = state.board.makeMove(sign, vertex, {
        preventOverwrite: true,
        preventSuicide: false,
        preventKo: true,
      });
      state.history.push(state.board);
      state.board = newBoard;
      state.turn = player.color === Color.White ? Color.Black : Color.White;
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
    // if the last two moves were passes
    if (
      state.history.length >= 2 &&
      isPass(state.history[state.history.length - 2])
    ) {
      // end the game
      state.turn = Color.None;
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
    const lastTurn = state.history.pop();
    if (lastTurn == null) {
      return Response.error("Nothing to undo.");
    }
    // the request from the first player is recorded
    if (state.undoRequested === undefined) {
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
      state.board = lastTurn;
      state.turn = state.turn === Color.White ? Color.Black : Color.White;
    }
    state.undoRequested = undefined;
    return Response.ok();
  }
  getUserState(state: InternalState, userId: UserId): GameState {
    return {
      signMap: state.board.signMap,
      turn: state.turn,
      players: state.players,
      undoRequested: state.undoRequested,
    };
  }
}
