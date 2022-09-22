import React from "react";
import "./App.css";
import Graph from "./graph/Graph";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
