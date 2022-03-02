import React from "react";
import { useAppContext } from "./AppContext";
import Button from "./components/Button";
import BoardSizeSelect from "./components/BoardSizeSelect";
import ColorSelect from "./components/ColorSelect";
import { Color } from "../../../api/types";

function Home() {
  const { createGame, preferredBoardSize } = useAppContext();
  const [boardSize, setBoardSize] = React.useState(preferredBoardSize);
  const [selectedColor, setSelectedColor] = React.useState(Color.Black);
  return (
    <div className="flex h-screen flex-col space-y-20">
      <div className="flex justify-center">
        <h1 className="font-medium leading-tight text-5xl mt-6 text-gray-800">
          Calm Go
        </h1>
      </div>
      <div className="flex h-screen flex-col space-y-20">
        <BoardSizeSelect size={boardSize} onChange={setBoardSize} />
        <ColorSelect color={selectedColor} onChange={setSelectedColor} />
        <div className="flex place-items-center justify-center">
          <Button
            size="large"
            variant="secondary"
            onClick={() => createGame({ boardSize, selectedColor })}
          >
            Create a Game
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
