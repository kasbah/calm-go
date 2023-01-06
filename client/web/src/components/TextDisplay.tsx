import * as React from "react";
import * as numberToWords from "number-to-words";
import { Color, GamePhase } from "../../../../api/types";
import { saveAs } from "file-saver";

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
  score,
  sgf,
  stateId,
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
    passes != null && passes.length > 0 && passes[0] === userPlayer?.color;

  let won;
  if (gamePhase === GamePhase.Ended) {
  }

  return (
    <div style={{ width: 400, maxWidth: "80vw" }}>
      {isLoaded && (
        <div>
          {turnNumber < 3 && gameCreatedBy !== playerLastJoined?.id && (
            <>
              {isPlaying && playerLastJoined?.id === userPlayer?.id
                ? "You"
                : colorToString(playerLastJoined.color)}
              {" just joined the game."}
              <br />
            </>
          )}
          {isPlaying && players.length !== 2 && (
            <>
              {"You have no opponent. "}
              <br />
              {linkCopied ? (
                <>
                  <span className="text-gray-500">
                    {"You have copied the link."}
                  </span>
                  {" Send it to a friend."}
                  {/* This button is not vissible just here to maintain the line-height when the actual button is clicked. */}
                  <button
                    aria-hidden={true}
                    style={{ height: 26, width: 1, visibility: "hidden" }}
                    disabled={true}
                  >
                    C
                  </button>
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
              <br />
            </>
          )}
          {gamePhase === GamePhase.Ended && (
            <>
              {score.winner === userPlayer?.color
                ? "You won the game."
                : score.winner === Color.White
                ? "White won the game."
                : score.winner === Color.Black
                ? "Black won the game."
                : "Who won the game depends on the scoring method you would like to use."}
              <br />
            </>
          )}
          {gamePhase !== GamePhase.Ended && (
            <>
              <span
                className={
                  (players.length !== 2 ? "text-gray-500" : "") + " inline"
                }
              >{`${turnText}`}</span>
              <span className="text-gray-500 italic inline">
                {isPlaying
                  ? ` You are playing ${colorText}.`
                  : " You are not playing in this game."}
              </span>
              <br />
            </>
          )}
          {gamePhase === GamePhase.Ended && (
            <>
              <span className="text-gray-500 italic inline">
                {isPlaying && ` You were playing ${colorText}.`}
              </span>
              <br />
            </>
          )}
          {gamePhase !== GamePhase.Ended && isUserTurn && (
            <>
              <span
                className={`${
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
                  {"pass."}
                </button>
              </span>
              <br />
            </>
          )}
          {passWillEndGame && (
            <>
              {"Passing now will end the game."}
              <br />
            </>
          )}
          {gamePhase !== GamePhase.NotStarted &&
            isPlaying &&
            !isUserTurn &&
            (hasRequestedUndo ? (
              <>
                {lastMoveWasPass ? (
                  <>
                    {"You passed and then you requested to undo your pass."}
                    <br />
                  </>
                ) : (
                  <>
                    {"You have requested to undo the last move."}
                    <br />
                  </>
                )}
              </>
            ) : (
              <>
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
                <br />
              </>
            ))}
          {opponentCaptures + playerCaptures > 0 && (
            <>
              <span className="text-gray-500 italic">
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
              </span>
              <br />
              <span className="text-gray-500 italic">
                {playerCaptures === 0 ? (
                  " You have not captured any stones yet."
                ) : (
                  <>
                    {" You have captured "}
                    {numberToWords.toWords(playerCaptures)}
                    {` stone${playerCaptures > 1 ? "s" : ""}.`}
                  </>
                )}
              </span>
            </>
          )}
          {gamePhase === GamePhase.Ended && (
            <div>
              <pre>{JSON.stringify(score, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      {gamePhase !== GamePhase.NotStarted && sgf && (
        <p className="text-gray-300">
          {"You can "}
          <button
            className="border border-gray-300 mx-1 px-1"
            onClick={() => saveSgf(stateId, sgf)}
          >
            {"save an SGF file"}
          </button>{" "}
          {" of this game."}
        </p>
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

function saveSgf(stateId: string, sgf: string) {
  const blob = new Blob([sgf], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `calm-go-0${stateId}.sgf`);
}
