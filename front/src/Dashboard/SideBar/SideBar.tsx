import React from "react";
import "./SideBar.css";
import SideTile from "./SideTile";

const SideBar = () => {
  return (
    <div className="side_bar">
      <h3 className="side_bar_header">WOEN</h3>
      <SideTile txt="Containers" route="/containers" />
    </div>
  );
};

export default SideBar;
