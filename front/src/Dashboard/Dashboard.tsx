import React from "react";
import SideBar from "./SideBar/SideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContainerBoard from "./ContainerBoard/ContainerBoard";
import "./Dashboard.css";
import { useAtom } from "jotai";
import { aJobs } from "../store";
import CWorkflow from "./WTemplates/CTemplate/CTemplate";
import WTemplates from "./WTemplates/WTemplates";
import Workflows from "./Workflows/Workflows";
const Dashboard = () => {
  const [jobs, setJobs] = useAtom(aJobs);
  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboard_content">
        <Routes>
          <Route path="containers" element={<ContainerBoard />} />
          <Route path="w-templates" element={<WTemplates />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="cworkflow/:id" element={<CWorkflow />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
