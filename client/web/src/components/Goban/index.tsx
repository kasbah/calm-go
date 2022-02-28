import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useWindowSize } from "@reach/window-size";
import { BoundedGoban } from "@sabaki/shudan";
import "@sabaki/shudan/css/goban.css";
import "./Goban.css";
import { HathoraConnection } from "../../../../.hathora/client";

import { Color } from "../../../../../api/types";
import { useAppContext } from "../../AppContext";

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

export default function Goban() {
  const windowSize = useWindowSize();
  const { stateId } = useParams();
  const { gameStates, getConnection, user } = useAppContext();
  const [connection, setConnection]: [HathoraConnection, any] = useState(null);
  const [hoverVertex, setHoverVertex] = useState(null);
  const [ghostStoneMap, setGhostStoneMap] = useState([]);

  const state = gameStates[stateId];
  const signMap = state?.signMap || defaultSignMap;
  const players = state?.players;

  const userPlayer = (players || []).find((p) => p.id === user?.id);
  const userColor = userPlayer?.color;
  const userSign =
    userColor === Color.White ? 1 : userColor === Color.Black ? -1 : 0;
  const isUserPlaying = userPlayer != null;
  const isUserTurn = state?.turn === userColor;

  // for marking the last move with a dot
  const markerMap = signMap.map((row, y) =>
    row.map((_, x) =>
      x === state?.lastMove?.x && y === state?.lastMove?.y
        ? { type: "circle" }
        : {}
    )
  );

  useEffect(() => {
    const g = signMap.map((row, y) =>
      row.map((_, x) =>
        isUserPlaying &&
        isUserTurn &&
        hoverVertex != null &&
        hoverVertex[0] === x &&
        hoverVertex[1] === y
          ? { sign: userSign, type: "good" }
          : null
      )
    );
    setGhostStoneMap(g);
  }, [hoverVertex, signMap]);

  useEffect(() => {
    if (connection == null) {
      const c = getConnection(stateId);
      setConnection(c);
    }
  });

  return (
    <div className="flex justify-center">
      <BoundedGoban
        signMap={signMap}
        ghostStoneMap={ghostStoneMap}
        markerMap={markerMap}
        maxWidth={windowSize.width}
        maxHeight={windowSize.height}
        fuzzyStonePlacement={true}
        animateStonePlacement={true}
        onVertexMouseEnter={(e, vertex) => {
          setHoverVertex(vertex);
        }}
        onVertexMouseLeave={(e, vertex) => {
          setHoverVertex((v) => {
            if (v[0] === vertex[0] && v[1] === vertex[1]) {
              return null;
            }
            return v;
          });
        }}
        onVertexClick={(e, vertex) => {
          if (connection != null) {
            connection.makeMove({ x: vertex[0], y: vertex[1] });
          }
        }}
      />
    </div>
  );
}
