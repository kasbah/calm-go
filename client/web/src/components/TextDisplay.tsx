import * as React from "react";
import { Color, GamePhase } from "../../../../api/types";

export default function TextDisplay({
  isLoaded,
  players,
  userPlayer,
  gamePhase,
  turn,
  hasRequestedUndo,
}) {
  const colorText =
    userPlayer && (userPlayer.color === Color.White ? "white" : "black");
  const turnString = turn === Color.Black ? "Black" : "White";
  const turnText =
    userPlayer?.color === turn
      ? "It's your turn."
      : `It's ${turnString.toLowerCase()}'s turn.`;
  return (
    <div className="w-full flex justify-center">
      {isLoaded && (
        <div className="flex flex-col">
          <div>
            <span>{`${turnText}`}</span>
            <span className="text-gray-500 italic">
              {colorText
                ? ` You are playing ${colorText}.`
                : " You are not playing."}
            </span>
          </div>
          {hasRequestedUndo && (
            <div>
              <span className="italic">
                You have requested to undo the last move.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
