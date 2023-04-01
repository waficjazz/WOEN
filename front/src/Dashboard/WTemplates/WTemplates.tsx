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
import SubmitForm from "./SubmitForm";
import { socket } from "../../Socket";
const WTemplates = () => {
  const [project, setProject] = useAtom(aProject);
  const [workflows, setWorkflows] = useState<IWTemplate[]>([]);
  const [templateRef] = useAutoAnimate<HTMLDivElement>();
  const [selectedTemplates, setSelectedTemplates] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    socket.on("wts", (workflow) => {
      updateWorkflows([workflow]);
    });
  }, [workflows]);

  //this function to update existing / add workflow from websocket event
  const updateWorkflows = (uWorkflows: IWTemplate[]) => {
    const updatedWorkflows = workflows.map((wf) => {
      const uWorkflow = uWorkflows.find((uw) => uw.id === wf.id);
      return uWorkflow ? uWorkflow : wf;
    });
    uWorkflows.forEach((uw) => {
      if (!workflows.some((wf) => wf.id === uw.id)) {
        updatedWorkflows.unshift(uw);
      }
    });
    setWorkflows(updatedWorkflows);
  };

  async function removeTemplate() {
    try {
      for (const id of selectedTemplates.keys()) {
        let response = await api.deleteTemplate(id);
        setWorkflows((prev) => prev?.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  }
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
  const selectTemplate = (id: string) => {
    const currentlySelected: Map<string, string> = selectedTemplates;
    if (currentlySelected.has(id)) {
      currentlySelected.delete(id);
      setSelectedTemplates(new Map<string, string>(currentlySelected));
    } else {
      currentlySelected.set(id, id);
      setSelectedTemplates(new Map<string, string>(currentlySelected));
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
        <div className="one_workflow_tools">
          <Button onClick={removeTemplate}>DELETE</Button>
        </div>
        <div className="workflow_table" ref={templateRef}>
          <div className="workflow_table_header ">
            <div style={{ width: "3%" }}>
              <input
                type="checkbox"
                checked={workflows.length === selectedTemplates.size}
                onClick={(e) => e.stopPropagation()}
                onChange={() => {
                  if (workflows.length === selectedTemplates.size) {
                    setSelectedTemplates(new Map<string, string>());
                  } else {
                    const newSelected: Map<string, string> = new Map<string, string>();
                    workflows.forEach((workflow) => {
                      newSelected.set(workflow.id, workflow.id);
                    });
                    setSelectedTemplates(newSelected);
                  }
                }}
              />
            </div>
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
                  {...workflow}
                  checked={selectedTemplates.has(workflow.id)}
                  select={() => selectTemplate(workflow.id)}
                  remove={removeTemplate}
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
