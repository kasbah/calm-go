import * as React from "react";
import { Color, GamePhase } from "../../../../api/types";

export default function TextDisplay({
  isLoaded,
  isCreator,
  players,
  userPlayer,
  gamePhase,
  turn,
  hasRequestedUndo,
  requestUndo,
}) {
  const [linkCopied, setLinkCopied] = React.useState(false);
  React.useEffect(() => {
    if (linkCopied) {
      setTimeout(() => setLinkCopied(false), 5000);
    }
  }, [linkCopied]);
  const turnString = turn === Color.Black ? "Black" : "White";
  const isUserTurn = userPlayer?.color === turn;
  const isPlaying = userPlayer != null;
  const colorText = userPlayer?.color === Color.White ? "white" : "black";
  const turnText = isUserTurn
    ? "It's your turn."
    : `It's ${turnString.toLowerCase()}'s turn.`;
  return (
    <div className="w-full flex justify-center text-center mt-10">
      {isLoaded && (
        <div className="flex flex-col">
          <div>
            {isPlaying && players.length !== 2 && (
              <span>
                {"You have no opponent. "}
                {linkCopied ? (
                  <>
                    <span className="text-gray-500 italic">
                      {"You have copied the link."}
                    </span>
                    {" Send it to a friend."}
                  </>
                ) : (
                  <>
                    <a
                      href="#"
                      className="font-bold"
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(window.location);
                        setLinkCopied(true);
                      }}
                    >
                      {"Copy the link"}
                    </a>
                    {" and send it to a friend."}
                  </>
                )}
              </span>
            )}
          </div>
          <div>
            <span
              className={players.length !== 2 ? "text-gray-500" : ""}
            >{`${turnText}`}</span>
            <span className="text-gray-500 italic">
              {isPlaying
                ? ` You are playing ${colorText}.`
                : " You are not playing."}
            </span>
          </div>
          <div>
            {gamePhase != GamePhase.NotStarted && isPlaying && !isUserTurn ? (
              hasRequestedUndo ? (
                <span>{"You have requested to undo the last move."}</span>
              ) : (
                <span className="text-gray-500 italic">
                  You may
                  <a
                    href="#"
                    className="font-bold"
                    onClick={(e) => {
                      e.preventDefault();
                      requestUndo();
                    }}
                  >
                    {players.length === 1 ? " undo " : " request to undo "}
                  </a>
                  your last move.
                </span>
              )
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
