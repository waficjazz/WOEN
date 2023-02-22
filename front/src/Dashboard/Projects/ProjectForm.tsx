import React, { useEffect, useState } from "react";
import "../ContainerBoard/ContainerBoard.css";
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
  const [project, setProject] = useState<IProject>();
  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    try {
      const response = await api.userSignUp(project);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container_form">
        <div>
          <Input label="Name" name="name" onChange={handleChange} />

          <Button>submit</Button>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;
