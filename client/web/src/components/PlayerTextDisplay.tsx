import * as React from "react";
import { Color, GamePhase } from "../../../../api/types";

export default function PlayerTextDisplay({
  player,
  turn,
  hasRequestedUndo,
  opponent,
  gamePhase,
}) {
  const colorText = player?.color === Color.White ? "white" : "black";
  const oppositeColor = player?.color === Color.White ? "Black" : "White";
  const opponentText = opponent == null ? "You have no opponent yet." : "";
  const playerTurnText =
    opponent == null
      ? "You have no opponent yet."
      : gamePhase === GamePhase.NotStarted
      ? `${oppositeColor} has joined the game.`
      : player?.color === turn
      ? "It's your turn."
      : `It's ${oppositeColor}'s turn.`;
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col">
        {player && (
          <div>
            <span>{`${playerTurnText}`}</span>
            <span className="text-gray-500 italic">{` You are playing ${colorText}.`}</span>
          </div>
        )}
        {hasRequestedUndo && (
          <div>
            <span className="italic">
              You have requested to undo the last move.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
