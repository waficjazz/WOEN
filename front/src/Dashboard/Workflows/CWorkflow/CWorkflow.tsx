import React, { useEffect, useState } from "react";
import Axios from "../../../axios";
import "./CWorkflow.css";
import SContainer from "./SContainer";
import Job from "./Jobs";
import { useAtom } from "jotai";
import { aJobs } from "../../../store";
import { ISContainer } from "../../types";

const CWorkflow = () => {
  const [jobs, setJobs] = useAtom(aJobs);
  const [containres, setContainers] = useState([] as ISContainer[]);
  useEffect(() => {
    const getSavedContainers = async () => {
      try {
        const response = await Axios.get("/containers/saved");
        if (response.status === 200) {
          setContainers(response.data.containers);
        }
        // handle non 200 response
      } catch (error) {
        console.log(error); //handle error
      }
    };
    getSavedContainers();
  }, []);
  return (
    <>
      <div className="jobs_container">
        {jobs.map((job) => {
          console.log(job.name);
          return <Job {...job} />;
        })}
      </div>
      <div className="tools_list">
        {containres.map((container) => {
          return <SContainer key={container.id} {...container} />;
        })}
      </div>
    </>
  );
};

export default CWorkflow;
