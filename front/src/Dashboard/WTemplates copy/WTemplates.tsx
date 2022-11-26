import { useState, useEffect } from "react";
import Button from "../../shared/Buttons/Button";
import "./Workflows.css";
import Axios from "../../axios";
import { IWorkflow } from "../types";
import CForm from "../WTemplates/CTemplate/CForm";
import WTemplateRow from "../WTemplates/WTemplateRow";

const WTemplates = () => {
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const getWorkflow = async () => {
    try {
      const response = await Axios.get("/workflow/list/all");
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
          <p>Workflows</p>
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
