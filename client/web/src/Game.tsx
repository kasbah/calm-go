import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HathoraConnection } from "../../.hathora/client";
import { lookupUser, UserData } from "../../../api/base";

import Goban from "./components/Goban";
import Button from "./components/Button";
import Modal from "./components/Modal";
import VsDisplay from "./components/VsDisplay";
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
