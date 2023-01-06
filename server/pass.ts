import {
  Color,
  Player,
  Move,
  GamePhase,
  GameState,
  UserId,
  IInitializeRequest,
  IJoinGameRequest,
  ILeaveGameRequest,
  ISetBoardSizeRequest,
  IPickColorRequest,
  IMakeMoveRequest,
  IPassRequest,
  IUndoRequest,
} from "../api/types";

export type Pass = { type: "pass"; color: Color };

export function isPass(obj: any): obj is Pass {
  return obj != null && obj.type === "pass";
}
