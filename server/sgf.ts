import GameTree from "@sabaki/immutable-gametree";
import sgf from "@sabaki/sgf";
import { Color, Move } from "../api/types";

const alphabet: Readonly<string[]> = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export function moveHistoryToSgf(
  moveHistory: { color: Color; move: Move | "pass" }[],
  boardSize: number
) {
  let tree = new GameTree();
  tree = tree.mutate((draft) => {
    draft.updateProperty(0, "GM", ["1"]);
    draft.updateProperty(0, "FF", ["4"]);
    draft.updateProperty(0, "CA", ["UTF-8"]);
    draft.updateProperty(0, "AP", ["calm-go:0.0.0"]);
    draft.updateProperty(0, "KM", ["6.5"]);
    draft.updateProperty(0, "DT", [getDate()]);
    draft.updateProperty(0, "SZ", [boardSize.toString()]);
  });
  let id = 0;
  for (const { color, move } of moveHistory) {
    const c = color === Color.Black ? "B" : "W";
    const m = move === "pass" ? "" : `${alphabet[move.x]}${alphabet[move.y]}`;
    tree = tree.mutate((draft) => {
      id = draft.appendNode(id, { [c]: [m] });
    });
  }
  return sgf.stringify(tree.root);
}

function getDate() {
  return new Date().toISOString().split("T")[0];
}
