import { useState } from "react";
import Input from "../../../shared/Inputs/Input";
import "./CWorkflow.css";
import Axios from "../../../axios";
import Button from "../../../shared/Buttons/Button";
interface Props {
  setShow: any;
}
const CFrom = (props: Props) => {
  const [wfName, setWfName] = useState("");

  const handleSubmit = async () => {
    let obj = { name: wfName };
    try {
      const response = await Axios.post("/workflow/create", obj);
      if (response.status === 201) {
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

export default CFrom;
