import React from "react";
import "./SideBar.css";
import { useNavigate } from "react-router-dom";
type Props = {
  txt: string;
  route: string;
  icon?: string;
};

const SideTile = ({ txt, route }: Props) => {
  const navigate = useNavigate();

  function handleClick(route: string) {
    console.log(route);
  }
  return (
    <div
      className="side_tile"
      onClick={() => {
        navigate(route);
      }}>
      {txt}
    </div>
  );
};

export default SideTile;
