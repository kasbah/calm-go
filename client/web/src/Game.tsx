import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWindowSize } from "@reach/window-size";
import { HathoraConnection } from "../../.hathora/client";
import { BoundedGoban } from "@sabaki/shudan";
import { getUserDisplayName, lookupUser, UserData } from "../../../api/base";
import "@sabaki/shudan/css/goban.css";
import "./goban-overrides.css";

import Button from "./components/Button";
import Modal from "./components/Modal";
import BoardSizeSelect from "./components/BoardSizeSelect";
import { VsDisplay } from "./components/PlayerDisplay";
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
  const windowSize = useWindowSize();
  const { stateId } = useParams();
  const { gameStates, getConnection, user } = useAppContext();
  const [connection, setConnection]: [HathoraConnection, any] = useState(null);
  const [oponents, setOponents] = useState([]);
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
  const playerIds = state?.players ?? [];
  const cancelLeaveRef = useRef();
  useEffect(() => {
    Promise.all(
      playerIds.map(async ({ id, color }) => {
        const user: UserData = await lookupUser(id);
        return { ...user, color };
      })
    ).then(setOponents);
  }, [`${playerIds}`]);
  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <BoundedGoban
          signMap={state?.signMap ?? defaultSignMap}
          markerMap={markerMap}
          maxWidth={windowSize.width}
          maxHeight={windowSize.height}
          fuzzyStonePlacement={true}
          animateStonePlacement={true}
          onVertexClick={(e, vertex) => {
            if (connection != null) {
              connection.makeMove({ x: vertex[0], y: vertex[1] });
            }
          }}
        />
      </div>
      <div className="flex flex-col space-y-10 ml-10 mr-10">
        <VsDisplay oponents={oponents} userId={user?.id} />
        <BoardSizeSelect
          size={state?.signMap.length.toString() ?? "9"}
          onChange={(size) => {
            if (connection != null) {
              connection.setBoardSize({ size });
            }
          }}
        />
        <Modal
          trigger={({ open }) => (
            <Button variant="secondary" onClick={open}>
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
