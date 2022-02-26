import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { HathoraClient, UpdateArgs } from "../../.hathora/client";
import Home from "./Home";
import Game from "./Game";

function App() {
  const [client, setClient] = useState(null);
  useEffect(async () => {
    const client = new HathoraClient(import.meta.env.VITE_APP_ID);
    setClient(client);
    console.log("token", localStorage.getItem("token"));
    let token = localStorage.getItem("token")
    if (token == null) {
      token = await client.loginAnonymous()
      localStorage.setItem("token", token);
    }
    console.log({ client });
    const user = HathoraClient.getUserFromToken(token);
    console.log({ user });
  }, []);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
