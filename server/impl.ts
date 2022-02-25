import Board from "@sabaki/go-board";
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
      return Response.error("You have already joined this game.");
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
    try {
      const newBoard = state.board.makeMove(
        sign,
        [request.move.x, request.move.y],
        {
          preventOverwrite: true,
          preventSuicide: true,
          preventKo: true,
        }
      );
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
  getUserState(state: InternalState, userId: UserId): GameState {
    return {
      signMap: state.board.signMap,
      turn: state.turn,
      players: state.players,
    };
  }
}
