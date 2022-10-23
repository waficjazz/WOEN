import React, { useCallback, useEffect, useState } from "react";
import Axios from "../../../axios";
import "./CWorkflow.css";
import SContainer from "./SContainer";
import Job from "./Jobs";
import { useAtom } from "jotai";
import { aJobs } from "../../../store";
import { ISContainer } from "../../types";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import CMenu from "./CMenu";

const CWorkflow = () => {
  const [mouseHover, setMouseHover] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [jobs, setJobs] = useAtom(aJobs);
  const [containres, setContainers] = useState([] as ISContainer[]);

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key == "Escape") setShowMenu(false);
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    if (mouseHover) if (event.code == "Space") setShowMenu(!showMenu);
    if (event.key == "Escape") setShowMenu(false);
  };
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

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("keyup", handleEscape);
    return () => {
      document.removeEventListener("keyup", handleEscape);
      document.removeEventListener("keypress", handleKeyPress);
    };
  });
  return (
    <>
      <div className="jobs_container" onMouseEnter={() => setMouseHover(true)} onMouseLeave={() => setMouseHover(false)}>
        {showMenu && <CMenu />}
        {jobs.map((job) => {
          console.log(job.name);
          return <Job {...job} key={job.id} />;
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
