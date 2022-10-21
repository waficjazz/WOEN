import React from "react";
import SideBar from "./SideBar/SideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContainerBoard from "./ContainerBoard/ContainerBoard";
import "./Dashboard.css";
import CWorkflow from "./Workflows/CWorkflow/CWorkflow";
import { useAtom } from "jotai";
import { test } from "../store";
const Dashboard = () => {
  const [count, setCount] = useAtom(test);
  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboard_content">
        {count}
        <Routes>
          <Route path="containers" element={<ContainerBoard />} />
          <Route path="cworkflow" element={<CWorkflow />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
