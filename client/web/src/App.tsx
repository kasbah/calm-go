import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import AppContextProvider from "./AppContext";
import Home from "./Home";
import Game from "./Game";

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Game />} path="/0:stateId" />
          <Route element={<div>Not found</div>} path="*" />
        </Routes>
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
