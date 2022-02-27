import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWindowSize } from "@reach/window-size";
import { HathoraConnection } from "../../.hathora/client";
import { BoundedGoban } from "@sabaki/shudan";
import { lookupUser, UserData } from "../../../api/base";
import "@sabaki/shudan/css/goban.css";
import "./goban-overrides.css";

import { GamePhase, Color } from "../../../api/types";
import Button from "./components/Button";
import Modal from "./components/Modal";
import BoardSizeSelect from "./components/BoardSizeSelect";
import ColorSelect from "./components/ColorSelect";
import { VsDisplay } from "./components/PlayerDisplay";
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
  const cancelLeaveRef = useRef();
  const { stateId } = useParams();
  const { gameStates, getConnection, user } = useAppContext();
  const [connection, setConnection]: [HathoraConnection, any] = useState(null);
  const [opponents, setOpponents] = useState([]);
  const [hoverVertex, setHoverVertex] = useState(null);
  const [ghostStoneMap, setGhostStoneMap] = useState([]);

  const navigate = useNavigate();
  const state = gameStates[stateId];
  const signMap = state?.signMap || defaultSignMap;
  const players = state?.players;

  const userPlayer = (players || []).find((p) => p.id === user?.id);
  const isGameStarted = state?.phase !== GamePhase.NotStarted;
  const userColor = userPlayer?.color;
  const userSign =
    userColor === Color.White ? 1 : userColor === Color.Black ? -1 : 0;
  const isUserPlaying = userPlayer != null;
  const isUserTurn = state?.turn === userColor

  // for marking the last move with a dot
  const markerMap = signMap.map((row, y) =>
    row.map((_, x) =>
      x === state?.lastMove?.x && y === state?.lastMove?.y
        ? { type: "point" }
        : {}
    )
  );

  useEffect(() => {
    if (connection == null) {
      const c = getConnection(stateId);
      setConnection(c);
    }
  });

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
    Promise.all(
      (players || []).map(async ({ id, color }) => {
        const oponent: UserData = await lookupUser(id);
        return { ...oponent, color };
      })
    ).then(setOpponents);
  }, [players]);

  return (
    <div className="flex flex-col">
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
      <div className="flex flex-col space-y-10 ml-10 mr-10">
        <VsDisplay oponents={opponents} userId={user?.id} />
        {!isUserPlaying && (
          <Button
            variant="secondary"
            onClick={() => {
              if (connection != null) {
                connection.joinGame({});
              }
            }}
          >
            Join Game
          </Button>
        )}
        {isUserPlaying && !isGameStarted && (
          <BoardSizeSelect
            size={state?.signMap.length.toString() ?? "9"}
            onChange={(size) => {
              if (connection != null) {
                connection.setBoardSize({ size });
              }
            }}
          />
        )}

        {isUserPlaying && !isGameStarted && (
          <ColorSelect
            color={userColor}
            onChange={(color) => {
              if (connection != null) {
                connection.pickColor({ color });
              }
            }}
          />
        )}

        {isUserPlaying && (
          <Modal
            trigger={({ open }) => (
              <Button variant="secondary" onClick={open}>
                Leave Game
              </Button>
            )}
            cancelRef={cancelLeaveRef}
            label="Confirm Exit"
            description="Are you sure you want to leave this game?"
            buttons={({ close }) => (
              <>
                <Button
                  variant="secondary"
                  onClick={close}
                  ref={cancelLeaveRef}
                >
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
        )}
      </div>
    </div>
  );
}

export default Game;
