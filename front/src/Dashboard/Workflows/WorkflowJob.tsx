import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faGear, faClock, faCircleXmark, faCirclePause } from "@fortawesome/free-solid-svg-icons";
import { IPlacement, IWJob } from "../../types";
import "./Workflows.css";
interface IProps extends IWJob {
  placement: IPlacement;
  top: number;
  left: number;
  onClick: any;
  isSelected: boolean;
}

const WorkflowJob = (props: IProps) => {
  const IconStatus = () => {
    return (
      <>
        {props.status === "pending" && (
          <FontAwesomeIcon fill="white" icon={faClock} size="lg" color={statusColor(props.status)} className="workflow_job_icon" />
        )}
        {props.status === "skipped" && (
          <FontAwesomeIcon fill="white" icon={faClock} size="lg" color={statusColor(props.status)} className="workflow_job_icon" />
        )}
        {props.status === "success" && (
          <FontAwesomeIcon icon={faCircleCheck} size="lg" color={statusColor(props.status)} className="workflow_job_icon" />
        )}
        {props.status === "running" && (
          <FontAwesomeIcon icon={faGear} fill="white" size="lg" color={statusColor(props.status)} className="workflow_job_icon " spin />
        )}
        {props.status === "failed" && (
          <FontAwesomeIcon icon={faCircleXmark} size="lg" color={statusColor(props.status)} className="workflow_job_icon " />
        )}
        {props.status === "paused" && (
          <FontAwesomeIcon icon={faCirclePause} size="lg" color={statusColor(props.status)} className="workflow_job_icon " />
        )}
      </>
    );
  };

  const statusColor = (status: string | undefined) => {
    switch (status) {
      case "skipped":
        return "black";
      case "success":
        return "green";
      case "failed":
        return "red";
      case "running":
        return "blue";
      case "pending":
        return "white";
      case "paused":
        return "rgb(255, 174, 0)";
      default:
        return "white";
    }
  };
  return (
    <div
      className={props.isSelected ? "workflow_job workflow_job_selected" : "workflow_job"}
      style={{ top: props.top, left: props.left }}
      id={props.id.toString()}
      onClick={props.onClick}>
      <IconStatus />
      <div className="job_name" style={{ borderColor: statusColor(props.status) }}>
        {props.name}
      </div>
      <div className="job_timing">
        {props.startedAt?.slice(11, 16)} {props.startedAt && "-"} {props.finishedAt?.slice(11, 16) || ""}
      </div>
      <div className="job_timing">{props.exitCode ? `exit ${props.exitCode}` : ""}</div>
    </div>
  );
};

export default WorkflowJob;
