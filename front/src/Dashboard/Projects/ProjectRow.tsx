import React from "react";
import { dateStyle } from "../../utils/time-format";
import ReactTimeAgo from "react-time-ago";
import { IProject } from "../../types";
interface Props extends IProject {}

const ProjectRow = ({ name, createdAt, updatedAt }: Props) => {
  return (
    <div className="workflow_row">
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
