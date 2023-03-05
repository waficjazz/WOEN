import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faCircleCheck, faClock, faCirclePause } from "@fortawesome/free-solid-svg-icons";
import { ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import "./Workflows.css";
import "../ContainerBoard/ContainerBoard.css";
import { IWorkflow } from "../../types";
import { getDuration, dateStyle } from "../../utils/time-format";
import ReactTimeAgo from "react-time-ago";

interface IProps extends IWorkflow {
  placements: any;
  remove: any;
  checked: boolean;
  select: () => void;
}

const WorkflowRow = ({ id, name, remove, owner, status, totalJobs, completedJobs, startedAt, finishedAt, checked, select }: IProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/one-workflow/${id}`);
  };

  const IconStatus = () => {
    return (
      <>
        {status === "pending" && <FontAwesomeIcon icon={faClock} size="sm" />}
        {status === "success" && <FontAwesomeIcon icon={faCircleCheck} size="sm" color="green" />}
        {status === "paused" && <FontAwesomeIcon icon={faCirclePause} size="sm" color="rgb(255, 174, 0)" />}
        {status === "running" && (
          <ColorRing
            visible={true}
            height="20"
            width="20"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["blue", "blue", "blue", "blue", "blue"]}
          />
        )}
      </>
    );
  };

  return (
    <>
      <div className="workflow_row" onClick={handleClick}>
        <div style={{ width: "2%" }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              select();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
        <div style={{ width: "3%" }}>
          <IconStatus />
        </div>
        <div style={{ width: "15%" }}>{name}</div>
        <div style={{ width: "15%" }}>
          {owner?.firstName} {owner?.lastName}
        </div>
        <div style={{ width: "15%" }}>{(startedAt && <ReactTimeAgo date={new Date(startedAt)} locale="en-US" timeStyle={dateStyle} />) || "-"}</div>
        <div style={{ width: "15%" }}>{(finishedAt && <ReactTimeAgo date={new Date(finishedAt)} locale="en-US" timeStyle={dateStyle} />) || "-"}</div>
        <div style={{ width: "10%" }}>
          {(finishedAt && startedAt && getDuration(new Date(startedAt), new Date(finishedAt))) ||
            (startedAt && <ReactTimeAgo date={new Date(startedAt)} locale="en-US" timeStyle="mini" />) ||
            "-"}
        </div>
        <div style={{ width: "10%" }}>
          {completedJobs}/{totalJobs}
        </div>
      </div>
    </>
  );
};

export default WorkflowRow;
