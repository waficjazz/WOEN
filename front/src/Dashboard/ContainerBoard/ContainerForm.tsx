import React, { useEffect, useState } from "react";
import Input from "../../shared/Buttons/Inputs/Input";
import "./ContainerBoard.css";
import Axios from "../../axios";
import Button from "../../shared/Buttons/Button";
const ContainerForm = () => {
  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  interface Container {
    domainName: string;
    hostName: string;
    image: string;
    commands: string[];
  }
  const [container, setContainer] = useState<Container>({} as Container);

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setContainer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("entered");
    console.log(container);
    const response = await Axios.post("/containers/create", container);
    console.log(response);
  };

  return (
    <>
      <div className="container_form">
        <Input placeholder="Host Name" name="hostName" onChange={handleChange} />
        <Input placeholder="Domain Name" name="domainName" onChange={handleChange} />
        <Input placeholder="Image" name="image" onChange={handleChange} />
        <Input placeholder="Commands" name="commands" onChange={handleChange} />
      </div>
      <Button onClick={handleSubmit}>submit</Button>
    </>
  );
};

export default ContainerForm;
