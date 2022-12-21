import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTrashCan, faClock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Workflows.css";
import "../ContainerBoard/ContainerBoard.css";
import { IWorkflow } from "../../types";
import { ColorRing } from "react-loader-spinner";
import { timeAgo, dateStyle, getDuration } from "../../utils/time-format";
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
            colors={["blue", "blue", "blue", "blue", "blue"]}
          />
        )}
      </>
    );
  };

  return (
    <>
      <div className="workflow_row" onClick={handleClick}>
        <div style={{ width: "5%" }}>
          <IconStatus />
        </div>
        <div style={{ width: "15%" }}>{name}</div>
        <div style={{ width: "15%" }}>
          {owner?.firstName} {owner?.lastName}
        </div>
        <div style={{ width: "15%" }}>{(startedAt && timeAgo.format(new Date(startedAt), dateStyle)) || "-"} </div>
        <div style={{ width: "15%" }}>{(finishedAt && timeAgo.format(new Date(finishedAt), dateStyle)) || "-"} </div>
        <div style={{ width: "10%" }}>{(finishedAt && startedAt && getDuration(new Date(startedAt), new Date(finishedAt))) || "-"}</div>
        <div style={{ width: "10%" }}>
          {completedJobs}/{totalJobs}
        </div>
        <FontAwesomeIcon icon={faTrashCan} className="action_icon" size="lg" onClick={(e) => remove(e, id)} />
      </div>
    </>
  );
};

export default WorkflowRow;
