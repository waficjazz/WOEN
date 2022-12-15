import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import Graph from "./graph/Graph";
import { Provider } from "jotai";
import SignUp from "./Auth/SignUp/SignUp";
import { useAtom } from "jotai";
import { aIsLoggedIn } from "./store";
import Auth from "./Auth/Auth";
import Axios from "./axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useAtom(aIsLoggedIn);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Provider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Dashboard />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
