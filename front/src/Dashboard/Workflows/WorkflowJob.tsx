import React from "react";
import { IPlacement, IWJob } from "../../types";
import "./Workflows.css";

interface IProps extends IWJob {
  placement: IPlacement;
  top: number;
  left: number;
}
const WorkflowJob = (props: IProps) => {
  return (
    <div className="workflow_job" style={{ top: props.top, left: props.left }} id={props.id.toString()}>
      {props.name}
      {props.id}
    </div>
  );
};

export default WorkflowJob;
