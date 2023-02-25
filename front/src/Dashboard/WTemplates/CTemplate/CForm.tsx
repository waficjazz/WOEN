import { useState } from "react";
import Input from "../../../shared/Inputs/Input";
import "./CTemplate.css";
import Button from "../../../shared/Buttons/Button";
import { ICWTemplate, IWorkflow } from "../../../types";
import { useAtom } from "jotai";
import { aProject } from "../../../store";
import * as api from "../api";

interface Props {
  setShow: any;
  addWorkflow: any;
}
const CForm = (props: Props) => {
  const [project, setProject] = useAtom(aProject);
  const [wfName, setWfName] = useState("");

  const handleSubmit = async () => {
    let obj: ICWTemplate = { name: wfName, projectId: project?.id || 0 };
    try {
      const response = await api.createWorkflow(obj);
      if (response.status === 201) {
        props.addWorkflow((prev: IWorkflow[]) => [...prev, response.data]);
        props.setShow(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="workflow_form">
      <Input placeholder="Workflow name" onChange={(e) => setWfName(e.target.value)} />
      <Button onClick={handleSubmit}> sumit</Button>
    </div>
  );
};

export default CForm;
