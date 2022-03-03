import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HathoraConnection } from "../../.hathora/client";

import { GamePhase } from "../../../api/types";
import Goban from "./components/Goban";
import Button from "./components/Button";
import PlayerTextDisplay from "./components/PlayerTextDisplay";
import { useAppContext } from "./AppContext";

export default function Game() {
  const { stateId } = useParams();
  const { gameStates, getConnection, user } = useAppContext();
  let connection: HathoraConnection | undefined;

  const state = gameStates[stateId];
  const players = state?.players;

  const userPlayer = (players || []).find((p) => p.id === user?.id);
  const opponent = userPlayer
    ? (players || []).find((p) => p.id !== user?.id)
    : null;
  const isUserPlaying = userPlayer != null;
  const hasRequestedUndo =
    state?.undoRequested != null && state?.undoRequested == user?.id;

  useEffect(() => {
    if (connection == null) {
      connection = getConnection(stateId);
      if (!isUserPlaying) {
        connection.joinGame({});
      }
    }
  });

  return (
    <div className="flex flex-col">
      <Goban />
      <div className="flex flex-col space-y-10 ml-10 mr-10 mb-10">
        <PlayerTextDisplay
          player={userPlayer}
          opponent={opponent}
          gamePhase={state?.phase}
          turn={state?.turn}
          hasRequestedUndo={hasRequestedUndo}
        />
        <div className="width-full text-center justify-center space-y-2">
          {isUserPlaying && state?.phase !== GamePhase.NotStarted && (
            <Button
              variant="secondary"
              className={hasRequestedUndo ? "italic text-sm" : ""}
              onClick={() => {
                console.log("Undo");
                if (connection != null) {
                  connection.undo({});
                }
              }}
            >
              {hasRequestedUndo ? "Cancel Undo Request" : "Undo"}
            </Button>
          )}
          {isUserPlaying && state?.players.length === 1 && (
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(window.location);
              }}
            >
              Copy Link
            </Button>
          )}
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
        </div>
      </div>
    </div>
  );
}
