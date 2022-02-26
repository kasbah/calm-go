import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HathoraConnection } from "../../.hathora/client";
import { Goban } from "@sabaki/shudan";
import "@sabaki/shudan/css/goban.css";

import { useAppContext } from "./AppContext";

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
  return (
    <div>
      <Goban
        onVertexClick={(e, vertex) => {
          if (connection != null) {
            connection.makeMove({ x: vertex[0], y: vertex[1] });
          }
        }}
        vertexSize={80}
        signMap={state?.signMap}
      />
    </div>
  );
}

export default Game;
