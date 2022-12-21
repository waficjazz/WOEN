import React from "react";
import "./SideBar.css";
import SideTile from "./SideTile";

const SideBar = () => {
  return (
    <div className="side_bar">
      <h2 className="side_bar_header">WOEN</h2>
      <SideTile txt="Containers" route="/containers" />
      <SideTile txt="Templates" route="/w-templates" />
      <SideTile txt="Workflows" route="/workflows" />
      <SideTile txt="Graph" route="/auth" />
    </div>
  );
};

export default SideBar;
