import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HathoraConnection } from "../../.hathora/client";
import { Goban } from "@sabaki/shudan";
import "@sabaki/shudan/css/goban.css";
import "./goban-overrides.css";

import Button from "./components/Button";
import Modal from "./components/Modal";
import SizeSelect from "./components/SizeSelect";
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
  const cancelLeaveRef = useRef();
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
        <SizeSelect
          size={state?.signMap.length.toString() ?? "9"}
          onChange={(size) => {
            if (connection != null) {
              connection.setBoardSize({ size });
            }
          }}
        />
        <Modal
          trigger={({ open }) => (
            <Button variant="danger" onClick={open}>
              Leave
            </Button>
          )}
          cancelRef={cancelLeaveRef}
          label="Confirm Exit"
          description="Are you sure you want to leave this game?"
          buttons={({ close }) => (
            <>
              <Button variant="secondary" onClick={close} ref={cancelLeaveRef}>
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
            </>
          )}
        />
      </div>
    </div>
  );
}

export default Game;
