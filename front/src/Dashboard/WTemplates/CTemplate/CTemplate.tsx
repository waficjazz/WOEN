import React, { useRef, useEffect, useState } from "react";
import "./CTemplate.css";
import Job from "./Job";
import { useParams, useLocation } from "react-router-dom";
import { IConnection, IJob, IPlacement } from "../../types";
import { useAtom } from "jotai";
import { aJobs, aShowMenu, aConnect, aDepends } from "../../../store";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import CMenu from "./CMenu";
import Axios from "../../../axios";

const CWorkflow = () => {
  const { id } = useParams();
  const [showMenu, setShowMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  const [connection, setConnection] = useAtom(aConnect);
  const [, setDependencies] = useAtom(aDepends);
  let biggestY = useRef(-1);
  let x = 0;
  let y = 0;
  const placement = useRef<IPlacement>({});
  // const [plc, setPlc] = useState({} as IPlacement);
  const [center, setCenter] = useState(0);
  const [initHeight, setInitHeight] = useState(20);

  useEffect(() => {
    calculateCenter();
    getWorkflowJobs();
    return () => {
      setJobs([]);
    };
  }, []);

  const getWorkflowJobs = async () => {
    try {
      const response = await Axios.get(`/workflow/${id}`);
      if (response.data) {
        setJobs(response.data.workflow.jobTemplates);
        let jobs: IJob[] = response.data.workflow.jobTemplates;
        let tmpConnection: IConnection = {};
        let tmpDepends: IConnection = {};
        jobs.map((job) => {
          tmpConnection[job["id"].toString()] = job["successors"];
          tmpDepends[job["id"].toString()] = job["dependencies"];
        });
        setConnection(tmpConnection);
        setDependencies(tmpDepends);
        if (response.data.workflow.placements !== null) placement.current = response.data.workflow.placements;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const savePlacement = async () => {
    try {
      const response = await Axios.post(`/workflow/${id}/placement`, { placements: placement.current });
      if (response.data) {
        // console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getBiggestY = () => {
    let bY = -1;
    Object.keys(placement.current).forEach((key) => {
      if (placement.current[key][1] > bY) {
        bY = placement.current[key][1];
      }
    });
    biggestY.current = bY;
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
      <button onClick={savePlacement}>save</button>
      <Xwrapper>
        <div className="jobs_container" id="jobscontainer">
          {id}
          <>
            {showMenu !== "" && <CMenu />}
            {Object.keys(connection).map((key) => {
              return connection[key]?.map((value) => {
                let k = Math.random().toString(36).substr(2, 3);
                return (
                  <Xarrow
                    key={k}
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
            {jobs.length > 0 &&
              jobs.map((job) => {
                y = biggestY.current + 1;
                let height = initHeight + y * 120;
                let left = center + x * 170;
                if (placement.current.hasOwnProperty(job.id.toString())) {
                  height = initHeight + placement.current[job.id.toString()][1] * 120;
                  left = center + placement.current[job.id.toString()][0] * 170;
                } else {
                  placement.current[job?.id?.toString()] = [x, y];
                }
                return <Job {...job} getBiggestY={getBiggestY} placement={placement.current} key={job.id} top={height} left={left} />;
              })}
          </>
        </div>
      </Xwrapper>
      {/* <div className="tools_list"></div> */}
    </>
  );
};

export default CWorkflow;
