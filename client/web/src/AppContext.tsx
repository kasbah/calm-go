import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { HathoraClient } from "../../.hathora/client";

const AppContext = createContext({
  user: null,
  gamesStates: {},
  connections: {},
  createGame: () => {},
});

export default function AppContextProvider({ children }) {
  const [client, setClient]: [HathoraClient, any] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [connections, setConnections] = useState({});
  const [gameStates, setGameStates] = useState({});
  const navigate = useNavigate();

  useEffect(async () => {
    const client = new HathoraClient(import.meta.env.VITE_APP_ID);
    setClient(client);
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

  const createGame = async () => {
    const onUpdate = ({ stateId, state }) => {
      setGameStates((states) => ({ ...states, [stateId]: state }));
    };
    const onConnectionFailure = (e) => {
      console.error("Connection failed:", e.message);
    };
    const connection = await client.connectNew(
      token,
      onUpdate,
      onConnectionFailure
    );
    setConnections((connections) => ({
      ...connections,
      [connection.stateId]: connection,
    }));
    navigate(`/game/${connection.stateId}/`);
  };

  return (
    <AppContext.Provider value={{ connections, createGame, gameStates, user }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
