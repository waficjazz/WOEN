import React, { useEffect, useState } from "react";
import "./ContainerBoard.css";
import Axios from "../../axios";
import Button from "../../shared/Buttons/Button";
import Input from "../../shared/Inputs/Input";
import CTextArea from "../../shared/TextAreas/CTextArea";

interface Props {
  show: boolean;
  close: any;
}
const ContainerForm = ({ show, close }: Props) => {
  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  type TextAreaEvent = React.ChangeEvent<HTMLTextAreaElement>;
  type KeyUpEvent = React.KeyboardEvent<HTMLTextAreaElement>;
  interface Container {
    domainName: string;
    name: string;
    image: string;
  }
  const [container, setContainer] = useState<Container>({} as Container);
  const [commandTxt, setCommandTxt] = useState("");
  const [shellType, setShellType] = useState("bash");

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setContainer((prev) => ({ ...prev, [name]: value }));
  };

  // const handleCommands = (e: KeyUpEvent) => {
  //   if (commandTxt.length === 1) {
  //     setCommandTxt((prev) => "- " + prev);
  //   }
  //   if (e.key === "Enter") {
  //     setCommandTxt((prev) => prev + "- ");
  //   }
  // };

  const parseCommands = (commands: string) => {
    let parsedCommands: any = commands.split("\n");
    return parsedCommands.join(" ; ");
  };

  const handleSubmit = async () => {
    try {
      let cmds = parseCommands(commandTxt);
      let arr = [shellType, "-c", cmds];
      let obj = { ...container, CMD: arr };
      const response = await Axios.post("/containers/create", obj);
      if (response.status === 201) {
        close(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container_form">
        <Input placeholder="Name" name="name" onChange={handleChange} />
        <Input placeholder="Domain Name" name="domainName" onChange={handleChange} />
        <Input placeholder="Image" name="image" onChange={handleChange} />
        <select className="select_shell" onChange={(e) => setShellType(e.target.value)}>
          <option value="bash">bash</option>
          <option value="sh">sh</option>
        </select>
        <CTextArea
          name="commands"
          placeholder="Commands"
          id="cmds"
          // onKeyUp={handleCommands}
          value={commandTxt}
          onChange={(e) => setCommandTxt(e.target.value)}
        />
        <Button onClick={handleSubmit}>submit</Button>
      </div>
    </>
  );
};

export default ContainerForm;
