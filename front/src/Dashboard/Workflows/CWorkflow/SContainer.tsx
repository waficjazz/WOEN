import React from "react";
import "./CWorkflow.css";
import { ISContainer } from "../../types";
import { useAtom } from "jotai";
import { aJobs, aShowMenu, aConnect, aSelectedJob } from "../../../store";

const SContainer = (props: ISContainer) => {
  const [showMenu, setShowMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  const [selectedJob] = useAtom(aSelectedJob);
  const [connection, setConnection] = useAtom(aConnect);

  const addToWorkflow = () => {
    if (showMenu == "add") {
      setJobs([...jobs, props]);
      setShowMenu("");
    }
    if (showMenu == "connect") {
      setConnection(connection.set(selectedJob, props.id));
    }
    setShowMenu("");
  };

  return (
    <div className="scontainer" onClick={addToWorkflow}>
      {props.name.substring(1)}
    </div>
  );
};

export default SContainer;
