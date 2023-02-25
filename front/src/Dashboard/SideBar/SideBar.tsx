import "./SideBar.css";
import SideTile from "./SideTile";
import { useAtom } from "jotai";
import { aProject } from "../../store";
import { useEffect } from "react";
const SideBar = () => {
  const [project, setProject] = useAtom(aProject);
  useEffect(() => {
    if (project === null) if (localStorage.getItem("project")) setProject(JSON.parse(localStorage.getItem("project")!!));
  }, []);
  return (
    <div className="side_bar">
      <h2 className="side_bar_header">WOEN</h2>
      <SideTile txt="Projects" route="/projects" />
      <SideTile txt="Groups" route="/groups" />
      {project !== null && (
        <>
          <SideTile txt="Containers" route={`/${project.name}/containers`} />
          <SideTile txt="Templates" route={`/${project.name}/w-templates`} />
          <SideTile txt="Workflows" route={`/${project.name}/workflows`} />
          <SideTile txt="Graph" route={`/${project.name}/graph`} />
        </>
      )}
    </div>
  );
};

export default SideBar;
