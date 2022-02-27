import React from "react";
import { useAppContext } from "./AppContext";
import Button from "./components/Button";
import SizeSelect from "./components/SizeSelect";

function Home() {
  const { createGame } = useAppContext();
  const [boardSize, setBoardSize] = React.useState("9");
  return (
    <div className="flex h-screen flex-col space-y-20">
      <div className="flex justify-center">
        <h1 className="font-medium leading-tight text-5xl mt-6 text-gray-800">
          Calm Go
        </h1>
      </div>
      <div className="flex h-screen flex-col space-y-20">
        <SizeSelect size={boardSize} onChange={setBoardSize} />
        <div className="flex place-items-center justify-center">
          <Button
            size="large"
            variant="secondary"
            onClick={() => createGame(parseInt(boardSize, 10))}
          >
            Create a Game
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
