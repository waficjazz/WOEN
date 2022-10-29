import { useState, useEffect } from "react";
import Button from "../../shared/Buttons/Button";
import CFrom from "./CWorkflow/CFrom";
import WorkflowRow from "./WorkflowRow";
import "./Workflows.css";
import Axios from "../../axios";
import { IWorkflow } from "../types";

const Workflows = () => {
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const getWorkflow = async () => {
    try {
      const response = await Axios.get("/workflow/list");
      if (response.data) {
        setWorkflows(response.data);
        console.log(response.data);
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
      <div className="workflow_board">
        <div className="workflow_board_header">
          <p>Workflows</p>
          <Button onClick={() => setShowForm(true)}>Create</Button>
        </div>
        <div className="workflow_table">
          {workflows &&
            workflows.length > 0 &&
            workflows.map((workflow) => {
              return <WorkflowRow key={workflow.id} id={workflow.id} name={workflow.name} />;
            })}
        </div>
      </div>
      {showForm && <CFrom setShow={setShowForm} addWorkflow={setWorkflows} />}
    </>
  );
};

export default Workflows;
