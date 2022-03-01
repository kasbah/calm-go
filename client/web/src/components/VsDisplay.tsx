import * as React from "react";
import { Color } from "../../../../api/types";

export default function VsDisplay({ oponents, userId }) {
  const userIndex = oponents.findIndex((o) => o.id === userId);
  return (
    <div className="w-full flex justify-center">
      <div className="flex w-full justify-evenly max-w-4xl">
        <PlayerDisplay player={oponents?.[0]} isUser={userIndex === 0} />
        <div className="text-xl">vs</div>
        <PlayerDisplay
          alignRight
          player={oponents?.[1]}
          isUser={userIndex === 1}
        />
      </div>
    </div>
  );
}

function PlayerDisplay({ player, isUser, alignRight = false }) {
  const shortName = player?.name.split("-").slice(1, 3).join("-");
  const circle =
    player?.color === Color.Black
      ? "●"
      : player?.color === Color.White
      ? "○"
      : "";
  const Circle = () => <div className="text-xl">{circle}</div>;
  return (
    <div>
      <div className={`${shortName ?? "text-gray-300"} flex space-x-2`}>
        {!alignRight && <Circle />}
        <div className={`ml-2 mr-2 ${alignRight ? "text-right" : ""}`}>
          {shortName ?? "(no one yet)"}
          <div
            className={`${
              alignRight ? "text-right" : ""
            } text-gray-300 text-sm`}
          >
            {isUser ? "(it's you)" : ""}
          </div>
        </div>
        {alignRight && <Circle />}
      </div>
    </div>
  );
}
