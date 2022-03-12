import * as React from "react";
import * as numberToWords from "number-to-words";
import { Color, GamePhase } from "../../../../api/types";

export default function TextDisplay({
  isLoaded,
  players,
  gameCreatedBy,
  userPlayer,
  gamePhase,
  turn,
  turnNumber,
  hasRequestedUndo,
  requestUndo,
  captures,
  pass,
  passes,
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

  const playerLastJoined = players?.[players.length - 1];

  const passWillEndGame =
    isLoaded &&
    gamePhase === GamePhase.InProgress &&
    isUserTurn &&
    userPlayer?.color === Color.White &&
    passes.length > 0;

  const lastMoveWasPass =
    passes != null && passes.length > 0 && passes[0] === userPlayer.color;

  return (
    <div>
      {turnNumber < 3 && gameCreatedBy !== playerLastJoined?.id && (
        <div className="h-6">
          {isPlaying && playerLastJoined?.id === userPlayer?.id
            ? "You"
            : colorToString(playerLastJoined.color)}
          {" just joined the game."}
        </div>
      )}
      {isLoaded && (
        <div className="flex flex-col space-y-1">
          {isPlaying && players.length !== 2 && (
            <>
              <div className="h-6">{"You have no opponent. "}</div>
              <div className="h-6">
                {linkCopied ? (
                  <>
                    <span className="text-gray-500">
                      {"You have copied the link."}
                    </span>
                    {" Send it to a friend."}
                  </>
                ) : (
                  <>
                    <button
                      className="border border-black px-1"
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(window.location);
                        setLinkCopied(true);
                      }}
                    >
                      {"Copy the link"}
                    </button>
                    {" and send it to a friend."}
                  </>
                )}
              </div>
            </>
          )}
          {gamePhase === GamePhase.Ended && (
            <div className="h-6">
              The game has ended.
            </div>
          )}
          {gamePhase !== GamePhase.Ended && (
            <div className="h-6">
              <span
                className={players.length !== 2 ? "text-gray-500" : ""}
              >{`${turnText}`}</span>
              <span className="text-gray-500 italic">
                {isPlaying
                  ? ` You are playing ${colorText}.`
                  : " You are not playing."}
              </span>
            </div>
          )}
          {isUserTurn && (
            <div
              className={`h-6 ${
                passWillEndGame
                  ? "text-black not-italic"
                  : players.length !== 2
                  ? "text-gray-400"
                  : "text-gray-500"
              } italic`}
            >
              {" You may choose to"}
              <button
                className="border border-gray-300 mx-1 px-1"
                onClick={pass}
              >
                {"pass"}
              </button>
              {"."}
            </div>
          )}
          {passWillEndGame && (
            <div className="h-6">
              <span className="text-black not-italic">
                {" Passing now will end the game."}
              </span>
            </div>
          )}
          {gamePhase !== GamePhase.NotStarted &&
            isPlaying &&
            !isUserTurn &&
            (hasRequestedUndo ? (
              <div className="h-6">
                {lastMoveWasPass
                  ? "You passed and then you requested to undo your pass."
                  : "You have requested to undo the last move."}
              </div>
            ) : (
              <div className="h-6">
                {lastMoveWasPass && "You passed. "}
                <span className="text-gray-500 italic">
                  You may
                  <button
                    className="border border-gray-300 mx-1 px-1"
                    onClick={requestUndo}
                  >
                    {players.length === 1 ? "undo" : "request to undo"}
                  </button>
                  {lastMoveWasPass ? "your pass." : "the last move."}
                </span>
              </div>
            ))}
          {opponentCaptures + playerCaptures > 0 && (
            <>
              <div className="h-6 text-gray-500 italic">
                {opponentColorText}
                {opponentCaptures === 0 ? (
                  " has not captured any stones yet."
                ) : (
                  <>
                    {" has captured "}
                    {numberToWords.toWords(opponentCaptures)}
                    {` stone${opponentCaptures > 1 ? "s" : ""}.`}
                  </>
                )}
              </div>
              <div className="h-6 text-gray-500 italic">
                {playerCaptures === 0 ? (
                  " You have not captured any stones yet."
                ) : (
                  <>
                    {" You have captured "}
                    {numberToWords.toWords(playerCaptures)}
                    {` stone${playerCaptures > 1 ? "s" : ""}.`}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function colorToString(color: Color): string {
  switch (color) {
    case Color.Black:
      return "Black";
    case Color.White:
      return "White";
    case Color.None:
    default:
      return "No color";
  }
}
