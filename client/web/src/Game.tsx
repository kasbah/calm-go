import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Goban } from "@sabaki/shudan";
import "@sabaki/shudan/css/goban.css";

import { useAppContext } from "./AppContext";

const signMap = [
  [1, 1],
  [1, 0],
];

function Game() {
  const { stateId } = useParams();
  const { gameStates, getConnection } = useAppContext();
  const [connection, setConnection] = useState(null);
  useEffect(() => {
    if (connection == null) {
      const c = getConnection(stateId);
      setConnection(c);
    }
  });
  const state = gameStates[stateId];
  return (
    <div>
      <Goban vertexSize={80} signMap={state?.signMap} />
    </div>
  );
}

export default Game;
