import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Graph from "./graph/Graph";
import { Provider } from "jotai";
function App() {
  return (
    <Provider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Dashboard />} />
            <Route path="/auth" element={<Graph />} />
            <Route path="/graph" element={<Graph />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
