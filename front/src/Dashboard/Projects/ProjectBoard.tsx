import React, { useEffect, useState } from "react";
import Button from "../../shared/Buttons/Button";
import { IProject } from "../../types";
import ProjectForm from "./ProjectForm";
import * as api from "./api";
import ProjectRow from "./ProjectRow";
const ProjectBoard = () => {
  const [showForm, setShowForm] = useState(false);
  const ProjectsTable = () => {
    const [projects, setProjects] = useState<IProject[]>([]);

    useEffect(() => {
      const getProjects = async () => {
        try {
          const response = await api.getProjects();
          if (response.data) {
            setProjects(response.data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      getProjects();
    }, []);
    return (
      <div className="workflow_table">
        <div className="workflow_table_header ">
          <div style={{ width: "25%" }}>NAME</div>
          <div style={{ width: "30%" }}>CREATED</div>
          <div style={{ width: "30%" }}>LAST UPDATE</div>
        </div>
        {projects &&
          projects.length > 0 &&
          projects.map((project) => {
            return <ProjectRow key={project.id} {...project} />;
          })}
      </div>
    );
  };

  return (
    <div className="table_board">
      <div className="table_board_header">
        <p>Projects</p>
        {!showForm && <Button onClick={() => setShowForm(true)}>Create</Button>}
      </div>
      {showForm ? <ProjectForm show={showForm} close={setShowForm} /> : <ProjectsTable />}
    </div>
  );
};

export default ProjectBoard;
