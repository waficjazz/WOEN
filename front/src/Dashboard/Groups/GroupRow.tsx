import React from "react";
import { dateStyle } from "../../utils/time-format";
import ReactTimeAgo from "react-time-ago";
import { IGroup, IProject } from "../../types";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { aProject } from "../../store";
interface Props extends IGroup {}

const GroupRow = ({ owner, name, createdAt, updatedAt }: Props) => {
  //   const navigate = useNavigate();
  //   const handlClick = () => {
  //     navigate(`/${name}/containers`);
  //   };
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
export default GroupRow;
