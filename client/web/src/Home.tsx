import React from "react";
import { useAppContext } from "./AppContext";
import Button from "./components/Button";

function Home() {
  const { createGame } = useAppContext();
  return (
    <div className="flex h-screen flex-col ">
      <div className="flex justify-center">
        <h1 className="font-medium leading-tight text-5xl mt-6 mb-2 text-gray-800">
          Calm Go
        </h1>
      </div>
      <div className="flex h-48 place-items-center justify-center">
        <Button
          size="large"
          variant="secondary"
          onClick={createGame}
        >
          Create a Game
        </Button>
      </div>
    </div>
  );
}

export default Home;
