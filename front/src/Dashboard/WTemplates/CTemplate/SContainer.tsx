import React, { useEffect, useRef } from "react";
import "./CTemplate.css";
import { ISContainer, IJob } from "../../types";
import { useAtom } from "jotai";
import { aJobs, aShowMenu, aConnect, aSelectedJob, aDepends } from "../../../store";
import Axios from "../../../axios";
import { useParams } from "react-router-dom";

const SContainer = (props: ISContainer) => {
  const params = useParams();
  const id = params.id || "0";
  const [showMenu, setShowMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  const [selectedJob] = useAtom(aSelectedJob);
  const [connection, setConnection] = useAtom(aConnect);
  const [depends, setDepends] = useAtom(aDepends);
  // const [newJob, setNewJob] = useState<IJob>();
  const newJob = useRef<IJob>();

  const updateJob = async () => {
    try {
      let old = connection[selectedJob] || [];
      let oldDepends = depends[props.id] || [];
      const response = await Axios.post("/workflow/job/update", { jobId: selectedJob, successors: [...old, props.id.toString()] });
      const response1 = await Axios.post("/workflow/job/update", { jobId: props.id, dependencies: [...oldDepends, selectedJob.toString()] });
    } catch (err) {
      console.log(err);
    }
  };
  const createJob = async () => {
    try {
      // random 4 letter name
      let name = Math.random().toString(36).substring(2, 6);
      const response = await Axios.post("/workflow/job/create", { workflowTemplateId: parseInt(id), name: name, containerId: props.id });
      if (response.status === 201) {
        newJob.current = response.data;
        setJobs([...jobs, response.data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const includeJob = (id: number) => {
    let a = false;
    if (jobs.length > 0)
      jobs.map((job: IJob) => {
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
      }
      setShowMenu("");
    }
    // connected job already in workflow
    if (showMenu == "connect") {
      //   if (!includeJob(props.id)) {
      //     createJob();
      //   }
      const currentValues = connection[selectedJob] || [];
      updateJob();
      setConnection({ ...connection, [selectedJob?.toString()]: [...currentValues, props.id?.toString()] });
      const currentDeps = depends[props.id]?.toString() || [];
      setDepends({ ...depends, [props.id.toString()]: [...currentDeps, selectedJob.toString()] });

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
