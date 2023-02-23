import React from "react";
import SideBar from "./SideBar/SideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContainerBoard from "./ContainerBoard/ContainerBoard";
import "./Dashboard.css";
import { useAtom } from "jotai";
import { aJobs } from "../store";
import CWorkflow from "./WTemplates/CTemplate/CTemplate";
import Projects from "./Projects/ProjectBoard";
import WTemplates from "./WTemplates/WTemplates";
import Workflows from "./Workflows/Workflows";
import CTemplate from "./WTemplates/CTemplate/CTemplate";
import OneWorkflow from "./Workflows/OneWorkflow";
const Dashboard = () => {
  const [jobs, setJobs] = useAtom(aJobs);
  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboard_content">
        <Routes>
          <Route path=":project/containers" element={<ContainerBoard />} />
          <Route path=":project/w-templates" element={<WTemplates />} />
          <Route path=":project/workflows" element={<Workflows />} />
          <Route path=":project/one-workflow/:wid" element={<OneWorkflow />} />
          <Route path=":project/cw-template/:id" element={<CTemplate />} />
          <Route path="projects" element={<Projects />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
