import * as React from "react";
import { Color } from "../../../../api/types";

export default function PlayerTextDisplay({ player, turn }) {
  const colorText = player?.color === Color.White ? "white" : "black";
  const opponentColor = player?.color === Color.White ? "black" : "white";
  const playerTurnText =
    player?.color === turn
      ? "It's your turn."
      : `It's ${opponentColor}'s turn.`;
  return (
    <div className="w-full flex justify-center">
      {player && (
        <div>
          <span>{`${playerTurnText}`}</span>
          <span className="text-gray-500 text-sm italic">{` You are playing ${colorText}.`}</span>
        </div>
      )}
    </div>
  );
}
