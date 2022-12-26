import { useState, useRef, useEffect } from "react";
import Button from "../../shared/Buttons/Button";
import WorkflowRow from "./WorkflowRow";
import "./Workflows.css";
import Axios from "../../axios";
import { IWorkflow } from "../../types";
import { socket } from "../../Socket";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Workflows = () => {
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [workflowRef] = useAutoAnimate<HTMLDivElement>();

  useEffect(() => {
    socket.on("wfs", (workflow) => {
      updateWorkflows(workflow);
    });
  }, [workflows]);

  const updateWorkflows = (uWorkflow: IWorkflow) => {
    // let exist = true;
    const newWorkflows = workflows.map((workflow) => {
      if (workflow.id === uWorkflow.id) {
        // exist = false;
        return uWorkflow;
      }
      return workflow;
    });
    // if (!exist) newWorkflows.push(uWorkflow);
    setWorkflows(newWorkflows);
  };

  async function removeWorkflow(e: MouseEvent, id: string) {
    try {
      e.stopPropagation();
      const response = await Axios.delete(`/workflow/one/${id}`);
      setWorkflows((prev) => prev?.filter((w) => w.id !== id));
    } catch (err) {
      console.log(err);
    }
  }
  const getWorkflow = async () => {
    try {
      const response = await Axios.get("/workflow/all");
      if (response.data) {
        setWorkflows(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWorkflow();
  }, []);

  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <div className="table_board">
        <div className="table_board_header">
          <p>Workflows</p>
          {/* <Button onClick={() => setShowForm(true)}>Create</Button> */}
        </div>
        <div className="workflow_table" ref={workflowRef}>
          <div className="workflow_table_header ">
            <div style={{ width: "5%" }}></div>
            <div style={{ width: "15%" }}>NAME</div>
            <div style={{ width: "15%" }}>USER</div>
            <div style={{ width: "15%" }}>STARTED</div>
            <div style={{ width: "15%" }}>FINISHED</div>
            <div style={{ width: "10%" }}>DURATION</div>
            <div style={{ width: "10%" }}>PROGRESS</div>
          </div>
          {workflows &&
            workflows.length > 0 &&
            workflows.map((workflow) => {
              return <WorkflowRow key={workflow.id} {...workflow} placements={workflow.placements} remove={removeWorkflow} />;
            })}
        </div>
      </div>
    </>
  );
};

export default Workflows;
