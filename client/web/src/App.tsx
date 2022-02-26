import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { HathoraClient, UpdateArgs } from "../../.hathora/client";
import AppContextProvider from "./AppContext"
import Home from "./Home";
import Game from "./Game";

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
