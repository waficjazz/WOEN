import React, { useCallback, useEffect, useState } from "react";
import "./CWorkflow.css";
import SContainer from "./SContainer";
import Job from "./Job";
import { useAtom } from "jotai";
import { aJobs, aShowMenu, aConnect } from "../../../store";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import CMenu from "./CMenu";

const CWorkflow = () => {
  const [mouseHover, setMouseHover] = useState(false);
  const [showMenu, setShowMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  const [connection, setConnection] = useAtom(aConnect);

  const handleClick = (event: MouseEvent) => {
    let target = event.target as HTMLDivElement;
    if (target?.id == "jobscontainer") setShowMenu("");
  };
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key == "Escape") setShowMenu("");
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    if (mouseHover)
      if (event.code == "Space") {
        if (showMenu == "") setShowMenu("add");
        if (showMenu !== "") setShowMenu("");
      }
    if (event.key == "Escape") setShowMenu("");
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
      <Xwrapper>
        <div className="jobs_container" id="jobscontainer" onMouseEnter={() => setMouseHover(true)} onMouseLeave={() => setMouseHover(false)}>
          <>
            {showMenu !== "" && <CMenu />}
            {Array.from(connection).map(([key, value]) => {
              console.log(key, value);
              return (
                <Xarrow
                  start={key}
                  end={value}
                  curveness={0.5}
                  startAnchor={"bottom"}
                  endAnchor={"top"}
                  color={"red"}
                  strokeWidth={2}
                  animateDrawing={0.5}
                />
              );
            })}
            {jobs.map((job) => {
              return <Job {...job} key={job.id} top={200} left={200} />;
            })}
          </>
        </div>
      </Xwrapper>
      {/* <div className="tools_list"></div> */}
    </>
  );
};

export default CWorkflow;
