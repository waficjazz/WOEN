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

  const includeJob = (id: string) => {
    let a = false;
    jobs.map((job: ISContainer) => {
      if (job.id === id) {
        a = true;
      }
    });
    return a;
  };
  const addToWorkflow = () => {
    if (showMenu == "add") {
      if (!includeJob(props.id)) setJobs([...jobs, props]);
      setShowMenu("");
    }
    if (showMenu == "connect") {
      if (!includeJob(props.id)) {
        setJobs([...jobs, props]);
      }
      const currentValues = connection[selectedJob] || [];
      setConnection({ ...connection, [selectedJob]: [...currentValues, props.id] });
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
