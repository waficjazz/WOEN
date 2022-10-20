import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Graph from "./graph/Graph";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Dashboard />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
