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
          <Route path="/" element={<Home />} />
          <Route path="/_/:stateId" element={<Game />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
