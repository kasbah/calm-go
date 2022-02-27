import * as React from "react";
import { Color } from "../../../../api/types";

export function VsDisplay({ oponents, userId }) {
  const userIndex = oponents.findIndex((o) => o.id === userId);
  return (
    <div className="flex w-full justify-evenly">
      <PlayerDisplay player={oponents?.[0]} isUser={userIndex === 0} />
      <div className="text-xl">vs</div>
      <PlayerDisplay
        alignRight
        player={oponents?.[1]}
        isUser={userIndex === 1}
      />
    </div>
  );
}

export function PlayerDisplay({ player, isUser, alignRight = false }) {
  const shortName = player?.name.split("-").slice(1, 3).join("-");
  const circle =
    player?.color === Color.Black
      ? "●"
      : player?.color === Color.White
      ? "○"
      : "";
  return (
    <div>
      <div>{circle}</div>
      <div className={shortName ?? "text-gray-300"}>
        {shortName ?? "(no one yet)"}
      </div>
      <div
        className={`${alignRight ? "text-right" : ""} text-gray-300 text-sm`}
      >
        {isUser ? "(it's you)" : ""}
      </div>
    </div>
  );
}
