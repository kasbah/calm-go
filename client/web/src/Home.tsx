import React from "react";
import { useAppContext } from "./AppContext";
import Button from "./components/Button";
import BoardSizeSelect from "./components/BoardSizeSelect";
import ColorSelect from "./components/ColorSelect";
import { Color } from "../../../api/types";
import Spinner from "./components/Spinner";

function Home() {
  const { userName, createGame, preferredBoardSize } = useAppContext();
  const [name, setName] = React.useState(userName);
  const [boardSize, setBoardSize] = React.useState(preferredBoardSize);
  const [selectedColor, setSelectedColor] = React.useState(Color.Black);
  const [gameIsLoading, setGameLoading] = React.useState(false);

  React.useEffect(() => {
    setName(userName);
  }, [userName]);

  return (
    <div>
      <div className="flex h-screen flex-col space-y-10">
        <div className="flex justify-center">
          <div className="flex flex-col justify-left space-y-12">
            <div className="text-xl mt-10 text-center">
              <span>{"Welcome to "}</span>
              <span className="text-gray-500 italic">{"Calm Go."}</span>
            </div>
            <div className="mx-5 text-center">
              Play{" "}
              <a
                className="underline"
                href="https://en.wikipedia.org/wiki/Go_(game)"
              >
                Go/Weiqi
              </a>{" "}
              online vs friends. No sign-up required.
            </div>
            <BoardSizeSelect size={boardSize} onChange={setBoardSize} />
            <ColorSelect color={selectedColor} onChange={setSelectedColor} />
            <div className="flex place-items-center justify-center">
              <Button
                className="max-w-[80%]"
                size="large"
                variant="secondary"
                onClick={() => {
                  setGameLoading(true);
                  setTimeout(() => {
                    setGameLoading(false);
                  }, 10_000);
                  createGame({ userName: name, boardSize, selectedColor });
                }}
              >
                {gameIsLoading ? <Spinner /> : "Create a Game"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
