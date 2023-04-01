import { useState, useRef, useEffect } from "react";
import Button from "../../shared/Buttons/Button";
import WorkflowRow from "./WorkflowRow";
import "./Workflows.css";
import { IWorkflow } from "../../types";
import { socket } from "../../Socket";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as api from "./api";
import { useAtom } from "jotai";
import { aProject } from "../../store";

const Workflows = () => {
  const [project, setProject] = useAtom(aProject);
  const [workflows, setWorkflows] = useState<IWorkflow[]>([]);
  const [workflowRef] = useAutoAnimate<HTMLDivElement>();
  const [selectedWorkflows, setSelectedWorkflows] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    socket.on("wfs", (workflow) => {
      console.log("websocket", workflow);
      updateWorkflows([workflow]);
    });
  }, [workflows]);

  //this function to update existing / add workflow from websocket event
  const updateWorkflows = (uWorkflows: IWorkflow[]) => {
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

  async function removeWorkflow() {
    try {
      for (const id of selectedWorkflows.keys()) {
        await api.deleteWorkflow(id);
        setWorkflows((prev) => prev?.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const pauseWorkflows = async () => {
    try {
      let uWorkflows: IWorkflow[] = [];
      for (const id of selectedWorkflows.keys()) {
        const response = await api.pauseWorkflow(id);
        if (response.data) {
          uWorkflows.push(response.data.workflow as IWorkflow);
        }
      }
      updateWorkflows(uWorkflows);
    } catch (err) {
      console.log(err);
    }
  };

  const resumeWorkflows = async () => {
    try {
      let uWorkflows: IWorkflow[] = [];
      for (const id of selectedWorkflows.keys()) {
        const response = await api.resumeWorkflow(id);
        if (response.data) {
          uWorkflows.push(response.data.workflow as IWorkflow);
        }
      }
      updateWorkflows(uWorkflows);
    } catch (err) {
      console.log(err);
    }
  };

  const getWorkflows = async () => {
    try {
      const response = await api.getWorkflows(project?.id);
      if (response.data) {
        setWorkflows(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const selectWorkflow = (id: string) => {
    const currentlySelected: Map<string, string> = selectedWorkflows;
    if (currentlySelected.has(id)) {
      currentlySelected.delete(id);
      setSelectedWorkflows(new Map<string, string>(currentlySelected));
    } else {
      currentlySelected.set(id, id);
      setSelectedWorkflows(new Map<string, string>(currentlySelected));
    }
  };
  useEffect(() => {
    getWorkflows();
  }, []);

  return (
    <>
      <div className="table_board">
        <div className="table_board_header">
          <p>Workflows</p>
          {/* <Button onClick={() => setShowForm(true)}>Create</Button> */}
        </div>
        <div className="one_workflow_tools">
          <Button onClick={resumeWorkflows}>RESUME</Button>
          <Button onClick={pauseWorkflows}>PAUSE</Button>
          <Button onClick={removeWorkflow}>DELETE</Button>
        </div>
        <div className="workflow_table" ref={workflowRef}>
          <div className="workflow_table_header ">
            <div style={{ width: "5%" }}>
              <input
                type="checkbox"
                checked={workflows.length === selectedWorkflows.size}
                onClick={(e) => e.stopPropagation()}
                onChange={() => {
                  if (workflows.length === selectedWorkflows.size) {
                    setSelectedWorkflows(new Map<string, string>());
                  } else {
                    const newSelected: Map<string, string> = new Map<string, string>();
                    workflows.forEach((workflow) => {
                      newSelected.set(workflow.id, workflow.id);
                    });
                    setSelectedWorkflows(newSelected);
                  }
                }}
              />
            </div>
            <div style={{ width: "15%" }}>NAME</div>
            <div style={{ width: "15%" }}>USER</div>
            <div style={{ width: "15%" }}>STARTED</div>
            <div style={{ width: "15%" }}>FINISHED</div>
            <div style={{ width: "10%" }}>DURATION</div>
            <div style={{ width: "10%" }}>PROGRESS</div>
          </div>
          {workflows &&
            workflows.length > 0 &&
            workflows.map((workflow) => {
              return (
                <WorkflowRow
                  key={workflow.id}
                  {...workflow}
                  placements={workflow.placements}
                  remove={removeWorkflow}
                  checked={selectedWorkflows.has(workflow.id)}
                  select={() => selectWorkflow(workflow.id)}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Workflows;
