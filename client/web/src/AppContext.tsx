import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { HathoraClient } from "../../.hathora/client";

const AppContext = createContext({
  user: null,
  createGame: async ({ selectedColor, boardSize }) => {},
  getConnection: (stateId) => {},
  gameStates: {},
  preferredBoardSize: "9",
});

const client: HathoraClient = new HathoraClient(import.meta.env.VITE_APP_ID);

export default function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [connections, setConnections] = useState({});
  const [gameStates, setGameStates] = useState({});
  const [preferredBoardSize, setPreferredBoardSize] = useState("9");
  const navigate = useNavigate();

  useEffect(async () => {
    let t = localStorage.getItem("token");
    let u;
    try {
      u = HathoraClient.getUserFromToken(t);
    } catch (e) {
      u = null;
    }
    if (t == null || u == null) {
      t = await client.loginAnonymous();
      u = HathoraClient.getUserFromToken(t);
      localStorage.setItem("token", t);
    }
    setToken(t);
    setUser(u);
  }, []);

  useEffect(() => {
    const s = localStorage.getItem("preferredBoardSize");
    setPreferredBoardSize(s);
  }, []);

  useEffect(() => {
    localStorage.setItem("preferredBoardSize", preferredBoardSize);
  }, [preferredBoardSize]);

  const onUpdate = ({ stateId, state }) => {
    setGameStates((states) => ({ ...states, [stateId]: state }));
  };

  const onConnectionFailure = (e) => {
    console.error("Connection failed:", e.message);
  };

  const createGame = async ({ selectedColor, boardSize }) => {
    const connection = await client.connectNew(
      token,
      onUpdate,
      onConnectionFailure
    );
    setConnections((connections) => ({
      ...connections,
      [connection.stateId]: connection,
    }));
    setPreferredBoardSize(boardSize)
    connection.setBoardSize({ size: parseInt(boardSize, 10) });
    connection.pickColor({ color: selectedColor });
    navigate(`/game/${connection.stateId}`);
  };

  const getConnection = (stateId) => {
    let connection = connections[stateId];
    if (connection == null && token != null) {
      connection = client.connectExisting(
        token,
        stateId,
        onUpdate,
        onConnectionFailure
      );
      setConnections((connections) => ({
        ...connections,
        [connection.stateId]: connection,
      }));
    }
    return connection;
  };

  return (
    <AppContext.Provider
      value={{ user, createGame, getConnection, gameStates, preferredBoardSize }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
