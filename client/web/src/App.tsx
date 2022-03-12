import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { HathoraClient, UpdateArgs } from "../../.hathora/client";
import AppContextProvider from "./AppContext";
import Home from "./Home";
import Game from "./Game";

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Game />} path="/_/:stateId" />
          <Route element={<div>Not found</div>} path="*" />
        </Routes>
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
