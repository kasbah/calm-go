import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { HathoraConnection } from "../../.hathora/client";

import { GamePhase, Color } from "../../../api/types";
import Goban from "./components/Goban";
import Button from "./components/Button";
import TextDisplay from "./components/TextDisplay";
import { useAppContext } from "./AppContext";
import Dialog from "./components/Dialog";

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
      <Goban />
      <div className="flex flex-col space-y-10 ml-10 mr-10 mb-10">
        <TextDisplay
          isLoaded={isLoaded}
          isCreator={state?.createdBy === userPlayer}
          players={state?.players}
          userPlayer={userPlayer}
          gamePhase={state?.phase}
          turn={state?.turn}
          hasRequestedUndo={hasRequestedUndo}
          requestUndo={sendUndo}
          captures={state?.captures}
        />
        <div className="width-full text-center justify-center space-y-2">
          <UndoRequestedDialog
            isUserPlaying={isUserPlaying}
            hasRequestedUndo={hasRequestedUndo}
            undoRequested={state?.undoRequested}
            performUndo={sendUndo}
            rejectUndo={() => {
              if (connection != null) {
                connection.rejectUndo({});
              }
            }}
          />
        </div>
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
      isOpen={isUserPlaying && !hasRequestedUndo && undoRequested != null}
      label="Undo Requested"
      description="Your opponent has requested to undo the last move."
      onDismiss={rejectUndo}
      leastDestructiveRef={acceptRef}
      buttons={
        <>
          <Button variant="danger" onClick={rejectUndo}>
            Reject
          </Button>
          <Button variant="secondary" ref={acceptRef} onClick={performUndo}>
            Accept
          </Button>
        </>
      }
    />
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
