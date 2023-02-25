import { useState, useEffect } from "react";
import Button from "../../shared/Buttons/Button";
import "./WTemplates.css";
import { IWTemplate } from "../../types";
import WTemplateRow from "./WTemplateRow";
import CForm from "./CTemplate/CForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as api from "./api";
import { useAtom } from "jotai";
import { aProject } from "../../store";
const WTemplates = () => {
  const [project, setProject] = useAtom(aProject);
  const [workflows, setWorkflows] = useState<IWTemplate[]>([]);
  const [templateRef] = useAutoAnimate<HTMLDivElement>();
  const getTemplates = async () => {
    try {
      const response = await api.getAllTemplates(project?.id);
      if (response.data) {
        setWorkflows(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <div className="table_board">
        <div className="table_board_header">
          <p>Workflows Templates</p>
          <Button onClick={() => setShowForm(true)}>Create</Button>
        </div>
        <div className="one_workflow_tools"></div>
        <div className="workflow_table" ref={templateRef}>
          <div className="workflow_table_header ">
            <div style={{ width: "25%" }}>NAME</div>
            <div style={{ width: "30%" }}>CREATED</div>
            <div style={{ width: "30%" }}>LAST UPDATE</div>
          </div>
          {workflows &&
            workflows.length > 0 &&
            workflows.map((workflow) => {
              return (
                <WTemplateRow
                  key={workflow.id}
                  id={workflow.id}
                  name={workflow.name}
                  placements={workflow.placements}
                  createdAt={workflow.createdAt}
                  updatedAt={workflow.updatedAt}
                />
              );
            })}
        </div>
      </div>
      {showForm && <CForm setShow={setShowForm} addWorkflow={setWorkflows} />}
    </>
  );
};

export default WTemplates;
