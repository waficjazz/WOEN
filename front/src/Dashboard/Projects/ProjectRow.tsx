import React from "react";
import { dateStyle } from "../../utils/time-format";
import ReactTimeAgo from "react-time-ago";
import { IProject } from "../../types";
import { useNavigate } from "react-router-dom";

interface Props extends IProject {}

const ProjectRow = ({ id, name, createdAt, updatedAt }: Props) => {
  const navigate = useNavigate();
  const handlClick = () => {
    localStorage.setItem("project", JSON.stringify({ pid: id, name: name }));
    navigate(`/${name}/containers`);
  };
  return (
    <div className="workflow_row" onClick={handlClick}>
      <div style={{ width: "25%" }}>{name}</div>
      <div style={{ width: "30%" }}>
        <ReactTimeAgo date={new Date(createdAt!!)} locale="en-US" timeStyle={dateStyle} />
      </div>
      <div style={{ width: "30%" }}>
        <ReactTimeAgo date={new Date(updatedAt!!)} locale="en-US" timeStyle={dateStyle} />
      </div>
    </div>
  );
};

export default ProjectRow;
