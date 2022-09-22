import React from "react";
import "./SideBar.css";
type Props = {
  txt: string;
  route: string;
  icon?: string;
};

const SideTile = ({ txt }: Props) => {
  return <div className="side_tile">{txt}</div>;
};

export default SideTile;
