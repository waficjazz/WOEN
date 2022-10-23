import React, { useCallback, useEffect, useState } from "react";
import "./CWorkflow.css";
import SContainer from "./SContainer";
import Job from "./Jobs";
import { useAtom } from "jotai";
import { aJobs, aShowMenu } from "../../../store";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import CMenu from "./CMenu";

const CWorkflow = () => {
  const [mouseHover, setMouseHover] = useState(false);
  const [showMenu, setShowMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);

  const handleClick = (event: MouseEvent) => {
    if (event.target?.id == "jobscontainer") setShowMenu(false);
  };
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key == "Escape") setShowMenu(false);
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    if (mouseHover) if (event.code == "Space") setShowMenu(!showMenu);
    if (event.key == "Escape") setShowMenu(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("keyup", handleEscape);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keyup", handleEscape);
      document.removeEventListener("keypress", handleKeyPress);
    };
  });
  return (
    <>
      <div className="jobs_container" id="jobscontainer" onMouseEnter={() => setMouseHover(true)} onMouseLeave={() => setMouseHover(false)}>
        {showMenu && <CMenu />}
        {jobs.map((job) => {
          console.log(job.name);
          return <Job {...job} key={job.id} />;
        })}
      </div>
      <div className="tools_list"></div>
    </>
  );
};

export default CWorkflow;
