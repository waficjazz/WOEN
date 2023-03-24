import React, { useEffect, useState } from "react";
import "../LiveContainerBoard/ContainerBoard.css";
import Button from "../../shared/Buttons/Button";
import Input from "../../shared/Inputs/Input";
import CTextArea from "../../shared/TextAreas/CTextArea";
import { InputEvent, IProject } from "../../types";
import * as api from "./api";
interface Props {
  show: boolean;
  close: any;
}
const ProjectForm = ({ show, close }: Props) => {
  const [project, setProject] = useState<IProject>({ id: 0 } as IProject);
  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    try {
      const response = await api.createProject(project);
      if (response.status === 201) close(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container_form">
        <div>
          <Input label="Name" name="name" onChange={handleChange} />
          <Button onClick={submit}>submit</Button>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;
