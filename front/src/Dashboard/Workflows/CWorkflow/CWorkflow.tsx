import React, { useRef, useEffect, useState } from "react";
import "./CWorkflow.css";
import Job from "./Job";
import { useParams } from "react-router-dom";
import { IPlacement } from "../../types";
import { useAtom } from "jotai";
import { aJobs, aShowMenu, aConnect } from "../../../store";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import CMenu from "./CMenu";

const CWorkflow = () => {
  const { id } = useParams();
  const [mouseHover, setMouseHover] = useState(false);
  const [showMenu, setShowMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  const [connection, setConnection] = useAtom(aConnect);

  let biggestY = -1;
  const placement = useRef({} as IPlacement);
  // const [placement, setPlacement] = useState<IPlacement>({});
  const [center, setCenter] = useState(0);
  const [initHeight, setInitHeight] = useState(20);

  const getBiggestY = () => {
    let bY = -1;
    Object.keys(placement.current).forEach((key) => {
      if (placement.current[key][1] > bY) {
        bY = placement.current[key][1];
      }
    });
    console.log(bY);
    return bY;
  };

  const calculateCenter = () => {
    let container = document.getElementById("jobscontainer");
    if (container) setCenter(container?.offsetWidth / 2 - 70 || 0);
  };

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
    calculateCenter();
  }, []);

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
          {id}
          <>
            {showMenu !== "" && <CMenu />}
            {Object.keys(connection).map((key) => {
              console.log(connection);
              return connection[key].map((value) => {
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
              });
            })}
            {jobs.map((job, index) => {
              let x = 0;
              let y = 0;
              biggestY = getBiggestY();
              y = biggestY + 1;
              biggestY = y;
              let height = initHeight + y * 120;
              let left = center + x * 170;
              placement.current[job.id] = [x, y];
              console.log(biggestY);
              return <Job {...job} placement={placement.current} key={job.id} top={height} left={left} />;
            })}
          </>
        </div>
      </Xwrapper>
      {/* <div className="tools_list"></div> */}
    </>
  );
};

export default CWorkflow;
