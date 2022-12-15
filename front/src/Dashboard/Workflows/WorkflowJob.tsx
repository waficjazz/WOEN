import { useEffect } from "react";
import { IPlacement, IWJob } from "../../types";
import "./Workflows.css";
import { socket } from "../../Socket";
interface IProps extends IWJob {
  placement: IPlacement;
  top: number;
  left: number;
}
const WorkflowJob = (props: IProps) => {
  useEffect(() => {
    console.log(`wj${props.id}`);
    socket.on(`wj${props.id}`, (data) => {
      console.log(data);
    });
  }, []);

  return (
    <div className="workflow_job" style={{ top: props.top, left: props.left }} id={props.id.toString()}>
      {props.name}
      {props.id}
    </div>
  );
};

export default WorkflowJob;
