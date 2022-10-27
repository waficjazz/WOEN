import React from "react";
import Button from "../../shared/Buttons/Button";
import "./Workflows.css";

const Workflows = () => {
  return (
    <div className="workflow_board">
      <div className="container_board_header">
        <p>Workflows</p>
        <Button>Create</Button>
      </div>
    </div>
  );
};

export default Workflows;
