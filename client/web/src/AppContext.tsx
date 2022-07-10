import React, { createContext, useEffect, useState, useContext } from "react";
import { Color } from "../../../api/types";
import { useNavigate } from "react-router-dom";

import { HathoraClient, HathoraConnection } from "../../.hathora/client";

const AppContext = createContext({
  user: null,
  userName: null,
  createGame: async () => {},
  getConnection: async () => {},
  gameStates: {},
  preferredBoardSize: "9",
});

const connections = {};

const client: HathoraClient = new HathoraClient();

export default function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [gameStates, setGameStates] = useState({});
  const [preferredBoardSize, setPreferredBoardSize] = useState("9");
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserAndToken = async () => {
      let token = localStorage.getItem(client.appId);
      let u;
      if (token == null) {
        token = await client.loginAnonymous();
        u = HathoraClient.getUserFromToken(token);
        localStorage.setItem(client.appId, token);
      }
      try {
        u = HathoraClient.getUserFromToken(token);
      } catch (e) {
        u = null;
      }
      setUser(u);
    };
    getUserAndToken();
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
    const token = localStorage.getItem(client.appId);
    const stateId = await client.create(token, {});
    const connection = await client.connect(
      token,
      stateId,
      onUpdate,
      onConnectionFailure
    );
    await connection.joinGame({});
    await connection.pickColor({ color: selectedColor });
    connections[stateId] = connection;
    setUserName(userName);
    setPreferredBoardSize(boardSize);
    await connection.setBoardSize({ size: parseInt(boardSize, 10) });
    navigate(`/0${stateId}`);
  };

  const getConnection = async (stateId: string) => {
    const token = localStorage.getItem(client.appId);
    let connection: HathoraConnection = connections[stateId];
    if (connection == null && token != null) {
      connection = await client.connect(
        token,
        stateId,
        onUpdate,
        onConnectionFailure
      );
      connections[stateId] = connection;
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
