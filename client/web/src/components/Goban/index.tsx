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
  const stateSignMap = state?.signMap;
  const [signMap, setSignMap] = useState(stateSignMap || defaultSignMap);
  const stateLastMove = state?.lastMove;
  const [lastMove, setLastMove] = useState(state?.lastMove);

  const players = state?.players;

  React.useEffect(() => {
    if (stateSignMap != null) {
      setSignMap(stateSignMap);
    }
  }, [stateSignMap]);

  React.useEffect(() => {
    setLastMove(stateLastMove);
  }, [stateLastMove]);

  const userPlayer = (players || []).find((p) => p.id === user?.id);
  const userColor = userPlayer?.color;
  const userSign =
    userColor === Color.White ? -1 : userColor === Color.Black ? 1 : 0;
  const isUserPlaying = userPlayer != null;
  const isUserTurn = state?.turn === userColor;

  // for marking the last move with a dot
  const markerMap = signMap.map((row, y) =>
    row.map((_, x) =>
      x === lastMove?.x && y === lastMove?.y ? { type: "circle" } : {}
    )
  );

  useEffect(() => {
    // appears as a grey dot when we use sign = 1
    const ghostStone = { sign: 1 };
    const g = signMap.map((row, y) =>
      row.map((_, x) =>
        isUserPlaying &&
        isUserTurn &&
        hoverVertex != null &&
        hoverVertex[0] === x &&
        hoverVertex[1] === y
          ? ghostStone
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
    <BoundedGoban
      animateStonePlacement={true}
      fuzzyStonePlacement={true}
      ghostStoneMap={ghostStoneMap}
      markerMap={markerMap}
      maxHeight={windowSize.height}
      maxWidth={windowSize.width}
      signMap={signMap}
      onVertexClick={(e, vertex) => {
        if (connection != null && isUserTurn) {
          connection.makeMove({ x: vertex[0], y: vertex[1] });
          setSignMap((signMap) => {
            if (signMap[vertex[1]][vertex[0]] === 0) {
              signMap[vertex[1]][vertex[0]] = userSign;
              setLastMove({ x: vertex[0], y: vertex[1] });
            }
            return signMap;
          });
        }
      }}
      onVertexMouseEnter={(e, vertex) => {
        setHoverVertex(vertex);
      }}
      onVertexMouseLeave={(e, vertex) => {
        setHoverVertex((v) => {
          if (v != null && v[0] === vertex[0] && v[1] === vertex[1]) {
            return null;
          }
          return v;
        });
      }}
    />
  );
}
