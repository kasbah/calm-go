import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HathoraConnection } from "../../.hathora/client";
import { Goban } from "@sabaki/shudan";
import "@sabaki/shudan/css/goban.css";
import "./goban-overrides.css";
import { Color } from "../../../api/types";

import { useAppContext } from "./AppContext";

const defaultSignMap = [
  [0, 0, 0, /* */ 0, 0, 0, /* */ 0, 0, 0],
  [0, 0, 0, /* */ 0, 0, 0, /* */ 0, 0, 0],
  [0, 0, 0, /* */ 0, 0, 0, /* */ 0, 0, 0],

  [0, 0, 0, /* */ 0, 0, 0, /* */ 0, 0, 0],
  [0, 0, 0, /* */ 0, 0, 0, /* */ 0, 0, 0],
  [0, 0, 0, /* */ 0, 0, 0, /* */ 0, 0, 0],

  [0, 0, 0, /* */ 0, 0, 0, /* */ 0, 0, 0],
  [0, 0, 0, /* */ 0, 0, 0, /* */ 0, 0, 0],
  [0, 0, 0, /* */ 0, 0, 0, /* */ 0, 0, 0],
];

function Game() {
  const { stateId } = useParams();
  const { gameStates, getConnection } = useAppContext();
  const [connection, setConnection]: [HathoraConnection, any] = useState(null);
  useEffect(() => {
    if (connection == null) {
      const c = getConnection(stateId);
      setConnection(c);
    }
  });
  const state = gameStates[stateId];
  // for marking the last move with a dot
  const markerMap = state?.signMap.map((row, y) =>
    row.map((_, x) =>
      x === state.lastMove?.x && y === state.lastMove?.y
        ? { type: "point" }
        : {}
    )
  );
  return (
    <div className="flex">
      <Goban
        signMap={state?.signMap ?? defaultSignMap}
        markerMap={markerMap}
        vertexSize={80}
        fuzzyStonePlacement={true}
        animateStonePlacement={true}
        onVertexClick={(e, vertex) => {
          if (connection != null) {
            connection.makeMove({ x: vertex[0], y: vertex[1] });
          }
        }}
      />
      <div className="flex flex-col space-y-4 mt-24">
        <button
          onClick={() => connection?.joinGame({})}
          className="bg-transparent hover:border-gray-300 hover:text-gray-500 font-semibold py-2 px-4 border border-gray-700 text-gray-700"
        >
          Join Game
        </button>
        <button
          onClick={() => connection?.pickColor({ color: Color.Black })}
          className="bg-transparent hover:border-gray-300 hover:text-gray-500 font-semibold py-2 px-4 border border-gray-700 text-gray-700"
        >
          Pick Black
        </button>
      </div>
    </div>
  );
}

export default Game;
