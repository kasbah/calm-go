import * as React from "react";
import { Color, GamePhase } from "../../../../api/types";

export default function TextDisplay({
  isLoaded,
  players,
  userPlayer,
  gamePhase,
  turn,
  hasRequestedUndo,
  requestUndo,
}) {
  const turnString = turn === Color.Black ? "Black" : "White";
  const isUserTurn = userPlayer?.color === turn;
  const isPlaying = userPlayer != null;
  const colorText = userPlayer?.color === Color.White ? "white" : "black";
  const turnText = isUserTurn
    ? "It's your turn."
    : `It's ${turnString.toLowerCase()}'s turn.`;
  return (
    <div className="w-full flex justify-center text-center">
      {isLoaded && (
        <div className="flex flex-col">
          <div>
            <span>{`${turnText}`}</span>
            <span className="text-gray-500 italic">
              {isPlaying
                ? ` You are playing ${colorText}.`
                : " You are not playing."}
            </span>
          </div>
          <div>
            {isPlaying && !isUserTurn ? (
              hasRequestedUndo ? (
                <span>{"You have requested to undo the last move."}</span>
              ) : (
                <span className="text-gray-500 italic">
                  You may
                  <a
                    href="#"
                    className="font-bold"
                    onClick={(e) => {
                      e.preventDefault();
                      requestUndo();
                    }}
                  >
                    {" request to undo "}
                  </a>
                  your last move.
                </span>
              )
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
