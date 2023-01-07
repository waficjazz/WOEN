import React, { useEffect, useState } from "react";
import "./ContainerBoard.css";
import Button from "../../shared/Buttons/Button";
import Input from "../../shared/Inputs/Input";
import CTextArea from "../../shared/TextAreas/CTextArea";
import { InputEvent } from "../../types";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as api from "./api";
interface Props {
  show: boolean;
  close: any;
}
const ContainerForm = ({ show, close }: Props) => {
  type TextAreaEvent = React.ChangeEvent<HTMLTextAreaElement>;
  type KeyUpEvent = React.KeyboardEvent<HTMLTextAreaElement>;

  interface envPair {
    [key: string]: string;
  }

  interface Container {
    domainName: string;
    name: string;
    image: string;
  }
  const [container, setContainer] = useState<Container>({} as Container);
  const [envPair, setEnvPair] = useState<envPair[]>([]);
  const [commandTxt, setCommandTxt] = useState("");
  const [shellType, setShellType] = useState("bash");

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;

    setContainer((prev) => ({ ...prev, [name]: value }));
  };

  const parseEnvPairs = (pairs: envPair[]) => {
    const arr = pairs.map((pair) => {
      if (pair[Object.keys(pair)[0]] !== undefined || pair[Object.keys(pair)[0]] !== "")
        return Object.keys(pair)[0] + "=" + pair[Object.keys(pair)[0]];
    });
    return arr;
  };

  const handleEnvPair = (e: InputEvent, i: number) => {
    const { name, value } = e.target;
    const oldValues = envPair;
    let obj;
    if (name == "env") {
      console.log(value);
      obj = { [value]: "" };
      oldValues[i] = obj;
    }
    if (name == "val") {
      obj = { [Object.keys(oldValues[i])[0]]: value };
      oldValues[i] = obj;
    }
    setEnvPair(oldValues);
  };

  // const handleCommands = (e: KeyUpEvent) => {
  //   if (commandTxt.length === 1) {
  //     setCommandTxt((prev) => "- " + prev);
  //   }
  //   if (e.key === "Enter") {
  //     setCommandTxt((prev) => prev + "- ");
  //   }
  // };

  useEffect(() => {
    console.log(envPair);
  }, [envPair]);

  const parseCommands = (commands: string) => {
    let parsedCommands: any = commands.split("\n");
    return parsedCommands.join(" ; ");
  };

  const handleSubmit = async () => {
    try {
      let Env = parseEnvPairs(envPair);
      let cmds = parseCommands(commandTxt);
      let arr = [shellType, "-c", cmds];
      let obj = { ...container, CMD: arr, Env };
      const response = await api.createContainer(obj);
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
        <div>
          <Input label="Name" name="name" onChange={handleChange} />
          <Input label="User" name="User" onChange={handleChange} />
          <Input label="WorkingDir" name="WorkingDir" onChange={handleChange} />
          <Input label="Image" placeholder="ex: alpine:latest" name="image" onChange={handleChange} />
          <div className="env_container">
            <div className="env_container_header">
              <div>Environment variables</div>
              <FontAwesomeIcon
                className="add_env_button"
                icon={faCirclePlus}
                onClick={() => {
                  setEnvPair([...envPair, { "": "" }]);
                }}
              />
            </div>
            <div className="env_pairs_container">
              {envPair.map((pair, i) => {
                return (
                  <>
                    <Input placeholder={"Env " + i} name="env" className="env_input" onChange={(e) => handleEnvPair(e, i)} key={"env" + i} />
                    <Input placeholder={"Value " + i} name="val" className="env_input" onChange={(e) => handleEnvPair(e, i)} key={"val" + i} />
                  </>
                );
              })}
            </div>
          </div>
        </div>
        <div>
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
      </div>
    </>
  );
};

export default ContainerForm;
