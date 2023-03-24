import { useEffect } from "react";
import SideBar from "./SideBar/SideBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Dashboard.css";
import { useAtom } from "jotai";
import { aJobs, aProject } from "../store";
import Projects from "./Projects/ProjectBoard";
import WTemplates from "./WTemplates/WTemplates";
import Workflows from "./Workflows/Workflows";
import CTemplate from "./WTemplates/CTemplate/CTemplate";
import OneWorkflow from "./Workflows/OneWorkflow";
import Groups from "./Groups/Groups";
import LiveContainerBoard from "./LiveContainerBoard/LiveContainerBoard";
import ContainerBoard from "./ContainerBoard/ContainerBoard";
const Dashboard = () => {
  const [jobs, setJobs] = useAtom(aJobs);
  const [project, setProject] = useAtom(aProject);
  useEffect(() => {
    if (!project.id) {
      if (localStorage.getItem("project")) setProject(JSON.parse(localStorage.getItem("project")!!));
    }
  }, []);
  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboard_content">
        <Routes>
          <Route path=":project/livecontainers" element={<LiveContainerBoard />} />
          <Route path=":project/containers" element={<ContainerBoard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path=":project/w-templates" element={<WTemplates />} />
          <Route path=":project/workflows" element={<Workflows />} />
          <Route path="one-workflow/:wid" element={<OneWorkflow />} />
          <Route path="cw-template/:id" element={<CTemplate />} />
          <Route path="projects" element={<Projects />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
