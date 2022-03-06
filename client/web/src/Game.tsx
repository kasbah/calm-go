import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HathoraConnection } from "../../.hathora/client";

import { GamePhase, Color } from "../../../api/types";
import Goban from "./components/Goban";
import Button from "./components/Button";
import TextDisplay from "./components/TextDisplay";
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

  const isUserTurn = state?.turn === userPlayer?.color;

  useEffect(() => {
    connection = getConnection(stateId);
    if (!isUserPlaying && state?.players.length !== 2 && connection != null) {
      connection.joinGame({});
    }
  });

  return (
    <div className="flex flex-col">
      <Goban />
      <div className="flex flex-col space-y-10 ml-10 mr-10 mb-10">
        <TextDisplay
          player={userPlayer}
          opponent={opponent}
          gamePhase={state?.phase}
          turn={state?.turn}
          hasRequestedUndo={hasRequestedUndo}
        />
        <div className="width-full text-center justify-center space-y-2">
          {!isUserTurn && (
            <UndoButton
              hasRequestedUndo={hasRequestedUndo}
              performUndo={() => {
                if (connection != null) {
                  connection.undo({});
                }
              }}
            />
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

function UndoButton({ hasRequestedUndo, performUndo }) {
  return (
    <Button
      variant="secondary"
      className={hasRequestedUndo ? "italic text-sm" : ""}
      onClick={performUndo}
    >
      {hasRequestedUndo ? "Cancel Undo Request" : "Undo"}
    </Button>
  );
}
