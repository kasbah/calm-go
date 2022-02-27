import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HathoraConnection } from "../../.hathora/client";
import { Goban } from "@sabaki/shudan";
import "@sabaki/shudan/css/goban.css";
import "./goban-overrides.css";

import Button from "./components/Button";
import Modal from "./components/Modal";
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
  const navigate = useNavigate();
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
        <Button variant="primary" onClick={() => connection?.joinGame({})}>
          Join Game
        </Button>
        <Button
          variant="secondary"
          onClick={() => connection?.pickColor({ color: Color.Black })}
        >
          Pick Black
        </Button>
        <Modal
          trigger={({ open }) => (
            <Button variant="danger" onClick={open}>
              Leave
            </Button>
          )}
          aria-label="Confirm exit"
        >
          {({ close }) => (
            <div className="space-y-4">
              <p className="text-center">
                Are you sure you want to leave this game?
              </p>
              <div className="flex space-x-4 justify-center">
                <Button variant="secondary" onClick={close}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (connection != null) {
                      connection.leaveGame({});
                      navigate("/");
                    }
                  }}
                >
                  Leave
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Game;
