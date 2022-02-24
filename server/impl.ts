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
} from "../api/types";

type InternalState = GameState;

const blankBoard = [
  [
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
  ],
  [
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
  ],
  [
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
  ],
  [
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
  ],
  [
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
  ],
  [
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
  ],
  [
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
  ],
  [
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
  ],
  [
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
    Color.None,
  ],
];

export class Impl implements Methods<InternalState> {
  initialize(userId: UserId, ctx: Context): InternalState {
    return {
      board: blankBoard,
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
      return Response.error("Player already joined.");
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
      return Response.error("Player not found.");
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
    return Response.error("Not implemented");
  }
  getUserState(state: InternalState, userId: UserId): GameState {
    return state;
  }
}
