import { useState } from "react";
import Button from "../../shared/Buttons/Button";
import CFrom from "./CWorkflow/CFrom";
import "./Workflows.css";

const Workflows = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <div className="workflow_board">
        <div className="container_board_header">
          <p>Workflows</p>
          <Button onClick={() => setShowForm(true)}>Create</Button>
        </div>
      </div>
      {showForm && <CFrom />}
    </>
  );
};

export default Workflows;
