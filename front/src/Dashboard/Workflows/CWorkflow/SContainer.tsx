import React, { useEffect } from "react";
import "./CWorkflow.css";
import { ISContainer } from "../../types";
import { useAtom } from "jotai";
import { aJobs, aShowMenu, aConnect, aSelectedJob, aDepends } from "../../../store";
import Axios from "../../../axios";
import { useParams } from "react-router-dom";

const SContainer = (props: ISContainer) => {
  const { id } = useParams();
  const [showMenu, setShowMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  const [selectedJob] = useAtom(aSelectedJob);
  const [connection, setConnection] = useAtom(aConnect);
  const [depends, setDepends] = useAtom(aDepends);

  const createJob = async () => {
    try {
      const response = await Axios.post("/workflow/job/create", { workflowId: id, name: "newjob", containerId: props.id });
      // if (response.status === 201) {
      //   setJobs([...jobs, props]);
      // }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(depends);
    console.log(connection);
  }, [depends]);

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
      if (!includeJob(props.id)) {
        createJob();
        setJobs([...jobs, props]);
      }
      setShowMenu("");
    }
    if (showMenu == "connect") {
      if (!includeJob(props.id)) {
        createJob();
        setJobs([...jobs, props]);
      }
      const currentValues = connection[selectedJob] || [];
      setConnection({ ...connection, [selectedJob]: [...currentValues, props.id] });
      // const currentDeps = depends[props.id] || [];
      // setDepends({ ...depends, [props.id]: [...currentDeps, selectedJob] });

      setShowMenu("");
    }
  };

  return (
    <div className="scontainer" onClick={addToWorkflow}>
      {props.name.substring(1)}
    </div>
  );
};

export default SContainer;
