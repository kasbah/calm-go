import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { HathoraClient } from "../../.hathora/client";

const APP_ID = import.meta.env.VITE_APP_ID

const AppContext = createContext({
  user: null,
  userName: null,
  createGame: async ({ selectedColor, boardSize }) => {},
  getConnection: (stateId) => {},
  gameStates: {},
  preferredBoardSize: "9",
});

const client: HathoraClient = new HathoraClient(APP_ID);

export default function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [connections, setConnections] = useState({});
  const [gameStates, setGameStates] = useState({});
  const [preferredBoardSize, setPreferredBoardSize] = useState("9");
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(async () => {
    let token = localStorage.getItem(APP_ID);
    let u;
    if (token == null) {
      token = await client.loginAnonymous();
      u = HathoraClient.getUserFromToken(token);
      localStorage.setItem(APP_ID, token);
    }
    try {
      u = HathoraClient.getUserFromToken(token);
    } catch (e) {
      u = null;
    }
    setUser(u);
  }, []);

  useEffect(() => {
    const s = localStorage.getItem("preferredBoardSize");
    setPreferredBoardSize(s);
  }, []);

  useEffect(() => {
    if (preferredBoardSize != null) {
      localStorage.setItem("preferredBoardSize", preferredBoardSize);
    }
  }, [preferredBoardSize]);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    setUserName(name);
  }, []);

  useEffect(() => {
    if (userName != null) {
      localStorage.setItem("userName", userName);
    }
  }, [userName]);

  const onUpdate = ({ stateId, state }) => {
    setGameStates((states) => ({ ...states, [stateId]: state }));
  };

  const onConnectionFailure = (e) => {
    console.error("Connection failed:", e.message);
  };

  const createGame = async ({ userName, selectedColor, boardSize }) => {
    const token = localStorage.getItem(APP_ID);
    const connection = await client.connectNew(
      token,
      onUpdate,
      onConnectionFailure
    );
    setConnections((connections) => ({
      ...connections,
      [connection.stateId]: connection,
    }));
    setUserName(userName);
    setPreferredBoardSize(boardSize);
    connection.setBoardSize({ size: parseInt(boardSize, 10) });
    connection.pickColor({ color: selectedColor });
    navigate(`/game/${connection.stateId}`);
  };

  const getConnection = (stateId) => {
    const token = localStorage.getItem(APP_ID);
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
      value={{
        user,
        userName,
        createGame,
        getConnection,
        gameStates,
        preferredBoardSize,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
