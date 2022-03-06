import * as React from "react";
import * as numberToWords from "number-to-words";
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
  captures,
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
  const opponentColor =
    userPlayer?.color === Color.White ? Color.Black : Color.White;
  const opponentColorText = opponentColor === Color.White ? "White" : "Black";
  const turnText = isUserTurn
    ? "It's your turn."
    : `It's ${turnString.toLowerCase()}'s turn.`;
  const opponentCaptures =
    isLoaded && captures[opponentColorText.toLowerCase()];
  const playerCaptures = isLoaded && captures[colorText];

  return (
    <div className="w-full flex justify-center text-center">
      {isLoaded && (
        <div className="flex flex-col space-y-10">
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
          {isPlaying && players.length === 2 && (
            <div>
              <div className="text-gray-500 italic">
                {opponentColorText}
                {opponentCaptures === 0 ? (
                  " has not captured any stones yet."
                ) : (
                  <>
                    {" has captured "}
                    <span className="text-black not-italic">
                      {numberToWords.toWords(opponentCaptures)}
                    </span>
                    {` stone${opponentCaptures > 1 ? "s" : ""}.`}
                  </>
                )}
                {playerCaptures === 0 ? (
                  ` You have not captured any stones yet${
                    opponentCaptures === 0 ? " either." : "."
                  }`
                ) : (
                  <>
                    {" You have captured "}
                    <span className="text-black not-italic">
                      {numberToWords.toWords(playerCaptures)}
                    </span>
                    {` stone${playerCaptures > 1 ? "s" : ""}.`}
                  </>
                )}
              </div>
            </div>
          )}
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
