import React, { useEffect, useState } from "react";
import Axios from "../../../axios";
import "./CWorkflow.css";
import SContainer from "./SContainer";
import { useAtom } from "jotai";
import { aJobs } from "../../../store";
import { ISContainer } from "../../typess";

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
      {jobs.map((job) => {
        console.log(job.name);
        return <div>{job.name}</div>;
      })}
      <div className="tools_list">
        {containres.map((container) => {
          return <SContainer id={container.id} key={container.id} name={container.name} image={container.image} />;
        })}
      </div>
    </>
  );
};

export default CWorkflow;
