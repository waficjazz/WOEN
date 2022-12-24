import { useState, useEffect, useRef } from "react";
import Axios from "../../axios";
import { useParams } from "react-router-dom";
import { IWJob, IConnection, IPlacement } from "../../types";
import { useAtom } from "jotai";
import { aConnect, aDepends } from "../../store";
import WorkflowJob from "./WorkflowJob";
import Xarrow, { Xwrapper } from "react-xarrows";
import { socket } from "../../Socket";
import JobDetails from "./JobDetails";

const OneWorkflow = () => {
  let x = 0;
  let y = 0;
  const placement = useRef<IPlacement>({});
  const [connection, setConnection] = useAtom(aConnect);
  const [, setDependencies] = useAtom(aDepends);
  const [jobs, setJobs] = useState<IWJob[]>([]);
  const [center, setCenter] = useState(0);
  const [initHeight, setInitHeight] = useState(20);
  const { wid } = useParams();
  const [selectedJob, setSelectedJob] = useState<number | undefined>();
  useEffect(() => {
    socket.on(`w${wid}`, (job) => {
      updateWorkflowJob(job);
    });
  }, [jobs]);

  useEffect(() => {
    calculateCenter();
    getWorkflowJobs();
  }, []);

  const handleClick = (event: MouseEvent) => {
    let target = event.target as HTMLDivElement;
    if (target?.id === "wjobscontainer") setSelectedJob(undefined);
  };

  const updateWorkflowJob = (uJob: IWJob) => {
    const newJobs = jobs.map((job) => {
      if (job.id === uJob.id) {
        return uJob;
      }
      return job;
    });
    setJobs(newJobs);
  };

  const getWorkflowJobs = async () => {
    try {
      const response = await Axios.get(`/workflow/one/${wid}`);
      if (response.data) {
        setJobs(response.data.jobs);
        let jobs: IWJob[] = response.data.jobs;
        let tmpConnection: IConnection = {};
        let tmpDepends: IConnection = {};
        jobs.map((job) => {
          let succ: string[] = [];
          job["successors"]?.map((s) => {
            succ.push(response.data.jidsMap[s]);
          });
          //   let dep: string[] = [];
          //   job["dependencies"]?.map((s) => {
          //     dep.push(response.data.jidsMap[s]);
          //   });
          tmpConnection[job["id"].toString()] = succ;
          tmpDepends[job["id"].toString()] = job["dependencies"];
        });
        setConnection(tmpConnection);
        setDependencies(tmpDepends);
        if (response.data.placements !== null) placement.current = response.data.placements;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const calculateCenter = () => {
    let container = document.getElementById("wjobscontainer");
    if (container) setCenter(container?.offsetWidth / 2 - 70 || 0);
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    <Xwrapper>
      <div className="one_workflow_page">
        <div className="one_workflow_header">
          <p>Workflow</p>
        </div>
        <div className="one_workflow_content">
          <div className="wjobs_container" id="wjobscontainer">
            <>
              {Object.keys(connection).map((key) => {
                return connection[key]?.map((value) => {
                  let k = Math.random().toString(36).slice(2, 3);
                  return (
                    <Xarrow
                      key={k}
                      start={key.toString()}
                      end={value.toString()}
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
                  let height = initHeight + y * 120;
                  let left = center + x * 170;
                  if (placement.current.hasOwnProperty(job.id.toString())) {
                    height = initHeight + placement.current[job.id.toString()][1] * 120;
                    left = center + placement.current[job.id.toString()][0] * 170;
                  } else {
                    placement.current[job?.id?.toString()] = [x, y];
                  }
                  return (
                    <WorkflowJob
                      isSelected={selectedJob === job.id}
                      {...job}
                      placement={placement.current}
                      key={job.id}
                      top={height}
                      left={left}
                      onClick={() => setSelectedJob(job.id)}
                    />
                  );
                })}
            </>
          </div>
          {selectedJob !== undefined && <JobDetails />}
        </div>
      </div>
    </Xwrapper>
  );
};

export default OneWorkflow;
