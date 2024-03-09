import React from "react";
import { Route, Routes } from "react-router-dom";
import StartGameMenuPage from "../Pages/startGameMenu";
import GamePage from "../Pages/game";

function Router() {
  return (
    <Routes>
      <Route path="/startGameMenu" element={<StartGameMenuPage />}></Route>
      <Route path="/game" element={<GamePage />}></Route>
    </Routes>
  );
}

export default Router;
