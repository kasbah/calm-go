import React, { createContext, useEffect, useState, useContext } from "react";
import { HathoraClient } from "../../.hathora/client";

const AppContext = createContext({
  client: null,
});

export default function AppContextProvider({ children }) {
  const [client, setClient] = useState(null);
  useEffect(async () => {
    const client = new HathoraClient(import.meta.env.VITE_APP_ID);
    setClient(client);
    let token = localStorage.getItem("token");
    if (token == null) {
      token = await client.loginAnonymous();
      localStorage.setItem("token", token);
    }
    const user = HathoraClient.getUserFromToken(token);
  }, []);
  return (
    <AppContext.Provider value={{ client }}>{children}</AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
