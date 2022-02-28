import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWindowSize } from "@reach/window-size";
import { HathoraConnection } from "../../.hathora/client";
import { lookupUser, UserData } from "../../../api/base";
import "@sabaki/shudan/css/goban.css";
import "./goban-overrides.css";

import { GamePhase, Color } from "../../../api/types";
import Goban from "./Goban"
import Button from "./components/Button";
import Modal from "./components/Modal";
import BoardSizeSelect from "./components/BoardSizeSelect";
import ColorSelect from "./components/ColorSelect";
import { VsDisplay } from "./components/PlayerDisplay";
import { useAppContext } from "./AppContext";


export default function Game() {
  const cancelLeaveRef = useRef();
  const { stateId } = useParams();
  const { gameStates, getConnection, user } = useAppContext();
  const [connection, setConnection]: [HathoraConnection, any] = useState(null);
  const [opponents, setOpponents] = useState([]);

  const navigate = useNavigate();
  const state = gameStates[stateId];
  const players = state?.players;

  const userPlayer = (players || []).find((p) => p.id === user?.id);
  const isGameStarted = state?.phase !== GamePhase.NotStarted;
  const userColor = userPlayer?.color;
  const isUserPlaying = userPlayer != null;

  useEffect(() => {
    if (connection == null) {
      const c = getConnection(stateId);
      setConnection(c);
    }
  });
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
      <Goban />
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
