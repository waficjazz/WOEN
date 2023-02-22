import React, { useEffect, useState } from "react";
import Button from "../../shared/Buttons/Button";
import ProjectForm from "./ProjectForm";

const ProjectBoard = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="table_board">
      <div className="table_board_header">
        <p>Projects</p>
        {!showForm && <Button onClick={() => setShowForm(true)}>Create</Button>}
      </div>
      {showForm ? <ProjectForm show={showForm} close={setShowForm} /> : <></>}
    </div>
  );
};

export default ProjectBoard;
