import { Color, Move } from "../api/types";

export type MoveAction = { color: Color; move: Move };
export type PassAction = { color: Color; move: "pass" };

export type Action = MoveAction | PassAction;

export function isPass(action?: Action): action is PassAction {
  return action != null && action.move === "pass";
}

export function isMove(action?: Action): action is MoveAction {
  return action != null && action.move !== "pass";
}
