import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faGear, faClock } from "@fortawesome/free-solid-svg-icons";
import { ColorRing } from "react-loader-spinner";
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
        {props.status === "pending" && <FontAwesomeIcon fill="white" icon={faClock} size="lg" color="yellow" className="workflow_job_icon" />}
        {props.status === "finished" && <FontAwesomeIcon icon={faCircleCheck} size="lg" color="green" className="workflow_job_icon" />}
        {props.status === "running" && <FontAwesomeIcon icon={faGear} fill="white" size="lg" color="blue" className="workflow_job_icon " spin />}
      </>
    );
  };

  const statusColor = (status: string | undefined) => {
    switch (status) {
      case "finished":
        return "green";
      case "failed":
        return "red";
      case "running":
        return "blue";
      case "pending":
        return "yellow";
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
      <div style={{ borderColor: statusColor(props.status) }}>{props.name}</div>
      {props.status}
    </div>
  );
};

export default WorkflowJob;
