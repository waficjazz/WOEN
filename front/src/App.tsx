import React from "react";
import "./App.css";
import Graph from "./graph/Graph";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Dashboard />
        <Routes>
          <Route path="/*" element={<Dashboard />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
