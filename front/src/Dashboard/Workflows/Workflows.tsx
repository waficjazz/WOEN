import { useState, useEffect } from "react";
import Button from "../../shared/Buttons/Button";
import CFrom from "./CWorkflow/CFrom";
import WorkflowRow from "./WorkflowRow";
import "./Workflows.css";
import Axios from "../../axios";

const WorkflowTable = () => {
  interface IWorkflow {
    id: string;
    name: string;
  }
  const [workflows, setWorkflows] = useState<IWorkflow[]>();

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

  return (
    <div className="container_table">
      {workflows &&
        workflows.length > 0 &&
        workflows.map((workflow) => {
          return <WorkflowRow id={workflow.id} name={workflow.name} />;
        })}
    </div>
  );
};

const Workflows = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <div className="workflow_board">
        <div className="container_board_header">
          <p>Workflows</p>
          <Button onClick={() => setShowForm(true)}>Create</Button>
        </div>
        <WorkflowTable />
      </div>
      {showForm && <CFrom setShow={setShowForm} />}
    </>
  );
};

export default Workflows;
