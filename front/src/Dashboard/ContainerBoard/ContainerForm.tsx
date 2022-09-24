import React, { useEffect, useState } from "react";
import Input from "../../shared/Buttons/Inputs/Input";
import "./ContainerBoard.css";
import Axios from "../../axios";
import Button from "../../shared/Buttons/Button";
import CTextArea from "../../shared/Buttons/TextAreas/CTextArea";
const ContainerForm = () => {
  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  type TextAreaEvent = React.ChangeEvent<HTMLTextAreaElement>;
  type KeyUpEvent = React.KeyboardEvent<HTMLTextAreaElement>;
  interface Container {
    domainName: string;
    hostName: string;
    image: string;
    commands: string[];
  }
  const [container, setContainer] = useState<Container>({} as Container);
  const [commands, setCommands] = useState<string[]>([]);
  const [commandTxt, setCommandTxt] = useState("");

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setContainer((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommands = (e: KeyUpEvent) => {
    if (e.key === "Enter") {
      setCommandTxt((prev) => prev + "- ");
    }
  };

  const handleSubmit = async () => {
    const response = await Axios.post("/containers/create", container);
  };

  return (
    <>
      <div className="container_form">
        <Input placeholder="Host Name" name="hostName" onChange={handleChange} />
        <Input placeholder="Domain Name" name="domainName" onChange={handleChange} />
        <Input placeholder="Image" name="image" onChange={handleChange} />
        <CTextArea name="commands" placeholder="Commands" id="cmds" onKeyUp={handleCommands} value={commandTxt} onChange={(e) => setCommandTxt(e.target.value)} />
        {/* <Input placeholder="Commands" name="commands" onChange={handleChange} /> */}
        <Button onClick={handleSubmit}>submit</Button>
      </div>
    </>
  );
};

export default ContainerForm;
