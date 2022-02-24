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
    state.players.push({ id: userId, color: Color.None });
    return Response.ok();
  }
  pickColor(
    state: InternalState,
    userId: UserId,
    ctx: Context,
    request: IPickColorRequest
  ): Response {
    const player = state.players.find((player) => player.id === userId);
    console.log(player, state.players)
    const oponent = state.players.find((player) => player.id !== userId);
    if (player == null) {
      return Response.error("Player not found");
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
