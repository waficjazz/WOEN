import React from "react";
import SideBar from "./SideBar/SideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContainerBoard from "./ContainerBoard/ContainerBoard";
import "./Dashboard.css";
const Dashboard = () => {
  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboard_content">
        <Routes>
          <Route path="c" element={<ContainerBoard />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
