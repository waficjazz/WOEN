import React, { useRef, useEffect, useState } from "react";
import "./CTemplate.css";
import { useParams } from "react-router-dom";
import { IConnection, IJob, IPlacement, IWorkflow, IWTemplate } from "../../../types";
import { useAtom } from "jotai";
import { aJobs, aShowMenu, aConnect, aDepends } from "../../../store";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import CMenu from "./CMenu";
import Job from "./Job";
import Button from "../../../shared/Buttons/Button";
import * as api from "../api";
import TJobDetails from "./TJobDeatils";
import TemplateDetails from "./TemplateDetails";

const CTemplate = () => {
  const { id } = useParams();
  const [showMenu, setShowMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  const [template, setTemplate] = useState<IWTemplate>({} as IWTemplate);
  const [connections, setConnections] = useAtom(aConnect);
  const [dependencies, setDependencies] = useAtom(aDepends);
  const [showDetails, setShowDetails] = useState(false);
  let biggestY = useRef(-1);
  let x = 0;
  let y = 0;
  const placement = useRef<IPlacement>({});
  // const [plc, setPlc] = useState({} as IPlacement);
  const [center, setCenter] = useState(0);
  const [initHeight, setInitHeight] = useState(20);
  const [selectedJob, setSelectedJob] = useState<number | undefined>();

  useEffect(() => {
    calculateCenter();
    getWorkflowJobs();
    return () => {
      setJobs([]);
    };
  }, []);

  const getWorkflowJobs = async () => {
    try {
      const response = await api.getTemplate(id!!);
      if (response.data) {
        setJobs(response.data.workflow.jobTemplates);
        setTemplate(response.data.workflow);
        let jobs: IJob[] = response.data.workflow.jobTemplates;
        let tmpConnection: IConnection = {};
        let tmpDepends: IConnection = {};
        jobs.map((job) => {
          tmpConnection[job["id"].toString()] = job["successors"];
          tmpDepends[job["id"].toString()] = job["dependencies"];
        });
        setConnections(tmpConnection);
        setDependencies(tmpDepends);
        if (response.data.workflow.placements !== null) placement.current = response.data.workflow.placements;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const savePlacement = async () => {
    try {
      const response = await api.updatePlacements(id!!, { placements: placement.current });
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

  const addJob = () => {
    if (showMenu == "") setShowMenu("add");
    if (showMenu !== "") setShowMenu("");
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code == "Space") {
      addJob();
    }
    if (event.key == "Escape") setShowMenu("");
  };

  const handleRemove = async (id: number) => {
    try {
      const response = await api.deleteJobTemplate(id);
      if (response.status === 200) {
        console.log("Job deleted");
      }
    } catch (error) {
      console.log(error);
    }
    setJobs(jobs.filter((job) => job.id !== id));
    delete placement.current[id.toString()];
    let jobConnections = connections[id.toString()];
    let jobDependencies = dependencies[id.toString()];
    if (jobConnections) {
      jobConnections.forEach(async (connection) => {
        let newDep = { [connection]: dependencies[connection]?.filter((job) => job !== id.toString()) };
        await api.updateJob({ jobId: parseInt(connection), successors: newDep[connection] });
        setDependencies({ ...dependencies, ...newDep });
      });
    }
    if (jobDependencies) {
      jobDependencies.forEach(async (dependency) => {
        let newConnection = { [dependency]: connections[dependency]?.filter((job) => job !== id.toString()) };
        await api.updateJob({ jobId: parseInt(dependency), successors: newConnection[dependency] });
        setConnections({ ...connections, ...newConnection });
      });
    }
    delete connections[id.toString()];
    setConnections((current) => {
      const { [id.toString()]: value, ...rest } = current;
      return rest;
    });
    setDependencies((current) => {
      const { [id.toString()]: value, ...rest } = current;
      return rest;
    });
    getBiggestY();
    setSelectedJob(undefined);
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
        <div className="one_workflow_page">
          <div className="one_workflow_header">
            <p>Workflow Template</p>
          </div>
          <div className="one_workflow_tools">
            <Button onClick={() => handleRemove(selectedJob!!)} style={{ height: "30px" }} disabled={selectedJob === undefined}>
              REMOVE
            </Button>
            <Button onClick={addJob} style={{ height: "30px" }}>
              ADD JOB
            </Button>
            <Button onClick={savePlacement} style={{ height: "30px" }}>
              SAVE
            </Button>
            <Button
              onClick={() => {
                setSelectedJob(undefined);
                setShowDetails(!showDetails);
              }}
              style={{ height: "30px" }}>
              Details
            </Button>
          </div>
          <div className="one_workflow_content">
            <div className="jobs_container" id="jobscontainer">
              <>
                {showMenu !== "" && <CMenu />}
                {Object.keys(connections).map((key) => {
                  return connections[key]?.map((value) => {
                    let k = Math.random().toString(36).substr(2, 3);
                    return (
                      <Xarrow
                        key={k}
                        start={key}
                        end={value}
                        curveness={0.5}
                        startAnchor={"bottom"}
                        endAnchor={"top"}
                        color={"rgb(255,255,255 , 0.2)"}
                        strokeWidth={1.5}
                        // animateDrawing={0.5}
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
                    return (
                      <Job
                        onClick={() => setSelectedJob(job.id)}
                        isSelected={selectedJob === job.id}
                        {...job}
                        getBiggestY={getBiggestY}
                        placement={placement.current}
                        key={job.id}
                        top={height}
                        left={left}
                        remove={handleRemove}
                      />
                    );
                  })}
              </>
            </div>
            {selectedJob !== undefined && (
              <TJobDetails
                {...jobs.find((j) => j.id === selectedJob)!!}
                templateParams={template.parameters}
                close={() => setSelectedJob(undefined)}
              />
            )}
            {showDetails && <TemplateDetails {...template} close={() => setShowDetails(false)} />}
          </div>
        </div>
      </Xwrapper>
      {/* <div className="tools_list"></div> */}
    </>
  );
};

export default CTemplate;
