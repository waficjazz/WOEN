import React from "react";
import "./CWorkflow.css";

interface ISContainer {
  id: string;
  name: string;
  image: string;
  commands?: string[];
}
const SContainer = (props: ISContainer) => {
  return <div className="scontainer">{props.name.substring(1)}</div>;
};

export default SContainer;
