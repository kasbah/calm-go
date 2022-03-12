import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { HathoraConnection } from "../../.hathora/client";

import Goban from "./components/Goban";
import Button from "./components/Button";
import TextDisplay from "./components/TextDisplay";
import { useAppContext } from "./AppContext";
import Dialog from "./components/Dialog";

import "./Game.css";

export default function Game() {
  const { stateId } = useParams();
  const { gameStates, getConnection, user } = useAppContext();
  let connection: HathoraConnection | undefined;

  const state = gameStates[stateId];
  const players = state?.players;

  const isLoaded = state != null;
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

  const sendUndo = () => {
    if (connection != null) {
      connection.undo({});
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="landscape:flex landscape:flex-wrap landscape:justify-center">
          <div>
            <Goban />
          </div>
          <div className="text-display-container mb-10 grow-0">
            <TextDisplay
              captures={state?.captures}
              gameCreatedBy={state?.createdBy}
              gamePhase={state?.phase}
              hasRequestedUndo={hasRequestedUndo}
              isLoaded={isLoaded}
              pass={() => {
                if (connection != null) {
                  connection.pass({});
                }
              }}
              passes={state?.passes}
              players={state?.players}
              requestUndo={sendUndo}
              turn={state?.turn}
              turnNumber={state?.turnNumber}
              userPlayer={userPlayer}
            />
          </div>
        </div>
      </div>
      <div className="width-full text-center justify-center space-y-2">
        <UndoRequestedDialog
          hasRequestedUndo={hasRequestedUndo}
          isUserPlaying={isUserPlaying}
          performUndo={sendUndo}
          rejectUndo={() => {
            if (connection != null) {
              connection.rejectUndo({});
            }
          }}
          undoRequested={state?.undoRequested}
        />
      </div>
    </div>
  );
}

function UndoRequestedDialog({
  isUserPlaying,
  hasRequestedUndo,
  undoRequested,
  performUndo,
  rejectUndo,
}) {
  const acceptRef = useRef();
  return (
    <Dialog
      buttons={
        <>
          <Button variant="secondary" onClick={rejectUndo}>
            Reject
          </Button>
          <Button ref={acceptRef} variant="primary" onClick={performUndo}>
            Accept
          </Button>
        </>
      }
      description="Your opponent has requested to undo the last move."
      isOpen={isUserPlaying && !hasRequestedUndo && undoRequested != null}
      label="Undo Requested"
      leastDestructiveRef={acceptRef}
      onDismiss={rejectUndo}
    />
  );
}

function UndoButton({ hasRequestedUndo, performUndo }) {
  return (
    <Button
      className={hasRequestedUndo ? "italic text-sm" : ""}
      variant="secondary"
      onClick={performUndo}
    >
      {hasRequestedUndo ? "Cancel Undo Request" : "Undo"}
    </Button>
  );
}
