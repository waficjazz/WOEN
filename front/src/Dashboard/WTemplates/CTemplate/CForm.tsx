import { useState } from "react";
import Input from "../../../shared/Inputs/Input";
import "./CTemplate.css";
import Button from "../../../shared/Buttons/Button";
import { IWorkflow } from "../../../types";
import * as api from "../api";
interface Props {
  setShow: any;
  addWorkflow: any;
}
const CForm = (props: Props) => {
  const [wfName, setWfName] = useState("");

  const handleSubmit = async () => {
    let obj = { name: wfName };
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
