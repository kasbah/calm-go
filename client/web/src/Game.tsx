import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HathoraConnection } from "../../.hathora/client";

import Goban from "./components/Goban";
import Button from "./components/Button";
import Modal from "./components/Modal";
import PlayerTextDisplay from "./components/PlayerTextDisplay";
import { useAppContext } from "./AppContext";

export default function Game() {
  const cancelLeaveRef = useRef();
  const { stateId } = useParams();
  const { gameStates, getConnection, user } = useAppContext();
  const [connection, setConnection]: [HathoraConnection, any] = useState(null);

  const navigate = useNavigate();
  const state = gameStates[stateId];
  const players = state?.players;

  const userPlayer = (players || []).find((p) => p.id === user?.id);
  const isUserPlaying = userPlayer != null;

  useEffect(() => {
    if (connection == null) {
      const c = getConnection(stateId);
      setConnection(c);
    }
  });

  return (
    <div className="flex flex-col">
      <Goban />
      <div className="flex flex-col space-y-10 ml-10 mt-4 mr-10 mb-10">
        <PlayerTextDisplay player={userPlayer} turn={state?.turn} />
        <div className="width-full text-center justify-center">
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
    </div>
  );
}
