import React from "react";
import { HathoraClient, UpdateArgs } from "../.hathora/client";
import { Goban } from "@sabaki/shudan";
import "@sabaki/shudan/css/goban.css";

const signMap = [
  [1, 1],
  [1, 0],
];

function Game() {
  return (
    <div>
      <Goban vertexSize={80} signMap={signMap} />
    </div>
  );
}

export default Game;
