import React from "react";
import "./CWorkflow.css";
import { ISContainer } from "../../types";
import { useAtom } from "jotai";
import { aJobs } from "../../../store";

const SContainer = (props: ISContainer) => {
  const [jobs, setJobs] = useAtom(aJobs);

  const addToWorkflow = () => {
    setJobs([...jobs, props]);
  };

  return (
    <div className="scontainer" onClick={addToWorkflow}>
      {props.name.substring(1)}
    </div>
  );
};

export default SContainer;
