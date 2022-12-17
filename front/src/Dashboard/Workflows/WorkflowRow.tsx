import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTrashCan, faClock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Workflows.css";
import "../ContainerBoard/ContainerBoard.css";
import { IWorkflow } from "../../types";
import { ColorRing } from "react-loader-spinner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

interface IProps extends IWorkflow {
  placements: any;
  remove: any;
}

const WorkflowRow = ({ id, name, remove, owner, status, totalJobs, completedJobs, startedAt, finishedAt }: IProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/one-workflow/${id}`);
  };

  const IconStatus = () => {
    return (
      <>
        {status === "pending" && <FontAwesomeIcon icon={faClock} size="sm" />}
        {status === "finished" && <FontAwesomeIcon icon={faCircleCheck} size="sm" color="green" />}
        {status === "running" && (
          <ColorRing
            visible={true}
            height="20"
            width="20"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["green", "green", "green", "green", "green"]}
          />
        )}
      </>
    );
  };
  dayjs.extend(relativeTime);

  return (
    <>
      <div className="workflow_row" onClick={handleClick}>
        <IconStatus />
        <p>{name}</p>
        <p>
          {owner?.firstName} {owner?.lastName}
        </p>
        <p>{(startedAt && dayjs(startedAt).fromNow()) || "-"} </p>
        <p>{(finishedAt && dayjs(finishedAt).fromNow()) || "-"} </p>
        {completedJobs}/{totalJobs}
        <FontAwesomeIcon icon={faTrashCan} className="action_icon" size="lg" onClick={(e) => remove(e, id)} />
      </div>
    </>
  );
};

export default WorkflowRow;
