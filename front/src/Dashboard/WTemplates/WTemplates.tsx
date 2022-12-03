import { useState, useEffect } from "react";
import Button from "../../shared/Buttons/Button";
import WorkflowRow from "./WTemplateRow";
import "./WTemplates.css";
import Axios from "../../axios";
import { IWorkflow } from "../../types";
import WTemplateRow from "./WTemplateRow";
import CForm from "./CTemplate/CForm";

const WTemplates = () => {
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const getWorkflow = async () => {
    try {
      const response = await Axios.get("/workflow/all/templates");
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
      <div className="workflow_board">
        <div className="workflow_board_header">
          <p>Workflows Templates</p>
          <Button onClick={() => setShowForm(true)}>Create</Button>
        </div>
        <div className="workflow_table">
          {workflows &&
            workflows.length > 0 &&
            workflows.map((workflow) => {
              return <WTemplateRow key={workflow.id} id={workflow.id} name={workflow.name} placements={workflow.placements} />;
            })}
        </div>
      </div>
      {showForm && <CForm setShow={setShowForm} addWorkflow={setWorkflows} />}
    </>
  );
};

export default WTemplates;
