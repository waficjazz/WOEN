import React, { useRef, useEffect, useState } from "react";
import "./CWorkflow.css";
import Job from "./Job";
import { useParams } from "react-router-dom";
import { IConnection, IJob, IPlacement } from "../../types";
import { useAtom } from "jotai";
import { aJobs, aShowMenu, aConnect, aDepends } from "../../../store";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import CMenu from "./CMenu";
import Axios from "../../../axios";

const CWorkflow = () => {
  interface Levels {
    [key: number]: string[];
  }
  const { id } = useParams();
  const [showMenu, setShowMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  const [connection, setConnection] = useAtom(aConnect);
  const [, setDependencies] = useAtom(aDepends);

  let biggestY = useRef(-1);
  let x = 0;
  let y = 0;
  const placement = useRef({} as IPlacement);
  // const [placement, setPlacement] = useState<IPlacement>({});
  const [center, setCenter] = useState(0);
  const [initHeight, setInitHeight] = useState(20);
  const [jobeLevels, setLevels] = useState("");
  let initJob = "67";

  let levels: Levels = {};
  const getJobLevels = (root: string, connections: IConnection) => {
    if (root === null) return 0;
    let tmp: string[] = [];
    let i = 0;
    levels[0] = [root];
    let nextLevel: string[] = [];
    nextLevel = nextLevel.concat([root]);
    while (nextLevel.length > 0) {
      tmp = [];
      i++;
      nextLevel.forEach((element) => {
        if (connections === undefined) return 0;
        if (connections[element] !== undefined) {
          tmp = tmp.concat(connections[element]!);
        }
      });
      levels[i] = [...new Set(tmp)];
      nextLevel = tmp;
    }
    ///set placement
    Object.keys(levels).map((key) => {
      let k = parseInt(key);
      let i = 0;
      levels[k].map((job) => {
        placement.current[job] = [i, k];
        i++;
      });
    });
    console.log(placement.current);
  };

  const getWorkflowJobs = async () => {
    try {
      const response = await Axios.get(`/workflow/${id}/jobs`);
      if (response.data) {
        setJobs(response.data);
        let jobs: IJob[] = response.data;
        let tmpConnection: IConnection = {};
        let tmpDepends: IConnection = {};
        jobs.map((job) => {
          tmpConnection[job["id"].toString()] = job["successors"];
          tmpDepends[job["id"].toString()] = job["dependencies"];
        });
        getJobLevels(initJob, tmpConnection);
        setConnection(tmpConnection);
        setDependencies(tmpDepends);
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
    calculateCenter();
    getWorkflowJobs();
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
            {jobs.map((job) => {
              y = biggestY.current + 1;
              let height = initHeight + y * 120;
              let left = center + x * 170;
              if (!placement.current[job.id.toString()]) {
                placement.current[job.id.toString()] = [height, left];
              }
              return (
                <Job
                  {...job}
                  getBiggestY={getBiggestY}
                  placement={placement.current}
                  key={job.id}
                  top={placement.current[job.id.toString()][1] * 120}
                  left={placement.current[job.id.toString()][0] * 170}
                />
              );
            })}
          </>
        </div>
      </Xwrapper>
      {/* <div className="tools_list"></div> */}
    </>
  );
};

export default CWorkflow;
