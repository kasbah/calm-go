import React from "react";
import { useAppContext } from "./AppContext";
import Button from "./components/Button";
import BoardSizeSelect from "./components/BoardSizeSelect";
import ColorSelect from "./components/ColorSelect";
import { Color } from "../../../api/types";

function Home() {
  const userNameInputRef = React.useRef();
  const { user, userName, createGame, preferredBoardSize } = useAppContext();
  const [name, setName] = React.useState(userName);
  const [boardSize, setBoardSize] = React.useState(preferredBoardSize);
  const [selectedColor, setSelectedColor] = React.useState(Color.Black);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      createGame({ userName: event.target.value, boardSize, selectedColor });
    }
  };

  React.useEffect(() => {
    userNameInputRef.current.focus();
    userNameInputRef.current.addEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    setName(userName)
  }, [userName]);

  return (
    <div>
      <div className="flex h-screen flex-col space-y-10">
        <div className="flex justify-center">
          <h1 className="font-medium leading-tight text-5xl mt-6 text-gray-800">
            Calm Go
          </h1>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col justify-left space-y-12">
            <BoardSizeSelect size={boardSize} onChange={setBoardSize} />
            <ColorSelect color={selectedColor} onChange={setSelectedColor} />
            <div>
              <label className="mr-2" htmlFor="user-name">
                Your name:
              </label>
              <input
                ref={userNameInputRef}
                className="border-gray-200"
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder={user?.name}
                value={name || ""}
                name="user-name"
              />
            </div>
            <div className="flex place-items-center justify-center">
              <Button
                size="large"
                variant="secondary"
                onClick={() =>
                  createGame({ userName: name, boardSize, selectedColor })
                }
              >
                Create a Game
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
