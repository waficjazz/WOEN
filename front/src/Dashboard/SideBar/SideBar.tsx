import "./SideBar.css";
import SideTile from "./SideTile";

const SideBar = () => {
  const project = JSON.parse(localStorage.getItem("project")!!);
  return (
    <div className="side_bar">
      <h2 className="side_bar_header">WOEN</h2>
      <SideTile txt="Containers" route={`/${project.name}/containers`} />
      <SideTile txt="Templates" route={`/${project.name}/w-templates`} />
      <SideTile txt="Workflows" route={`/${project.name}/workflows`} />
      <SideTile txt="Graph" route={`/${project.name}/graph`} />
    </div>
  );
};

export default SideBar;
