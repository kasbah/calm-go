import React from "react";
import { useAppContext } from "./AppContext";

function Home() {
  const { client } = useAppContext();
  console.log({client})
  return (
    <div className="flex h-screen flex-col ">
      <div className="flex justify-center">
        <h1 className="font-medium leading-tight text-5xl mt-6 mb-2 text-gray-800">
          Calm Go
        </h1>
      </div>
      <div className="flex h-48 place-items-center justify-center">
        <button className="bg-transparent hover:border-gray-300 hover:text-gray-500 font-semibold py-2 px-4 border border-gray-700 text-gray-700">
          Create a Game
        </button>
      </div>
    </div>
  );
}

export default Home;
