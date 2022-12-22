import { useEffect, useCallback, useState, useRef } from "react";
import { useAtom } from "jotai";
import { IJob, IPlacement } from "../../../types";
import { aShowMenu, aSelectedJob, aConnect, aDepends } from "../../../store";
import { useXarrow } from "react-xarrows";
import { aJobs } from "../../../store";

import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from "react-draggable";
import Axios from "../../../axios";

interface IProps extends IJob {
  placement: IPlacement;
  getBiggestY: () => void;
  top: number;
  left: number;
  isSelected: boolean;
  onClick: any;
}

const Job = (props: IProps) => {
  const [connections, setConnections] = useAtom(aConnect);
  const [dependencies, setDependencies] = useAtom(aDepends);
  const coor = useRef(props.placement[props.id.toString()]);
  const updateXarrow = useXarrow();
  const [, setShowMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  const [, setSelectedJob] = useAtom(aSelectedJob);
  const [initialCoord, setInitialCoord] = useState({ x: 0, y: 0 });

  useEffect(() => {
    props.getBiggestY();
  }, []);

  const setInitialCoordinates = (e: DraggableEvent, data: DraggableData) => {
    if (data) {
      setInitialCoord({ x: data.x, y: data.y });
    }
  };

  const calculatePlacement = (e: DraggableEvent, data: DraggableData) => {
    if (data) {
      let deltaX = data.x - initialCoord.x;
      let deltaY = data.y - initialCoord.y;
      if (deltaX / 170 > 1 || deltaX / 170 === 1) {
        coor.current[0] = Math.floor(deltaX / 170) + coor.current[0];
      }
      if (deltaX / 170 < -1 || deltaX / 170 === -1) {
        coor.current[0] = Math.ceil(deltaX / 170) + coor.current[0];
      }
      if (deltaY / 120 > 1 || deltaY / 120 === 1) {
        coor.current[1] = Math.floor(deltaY / 120) + coor.current[1];
      }
      if (deltaY / 120 < -1 || deltaY / 120 === -1) {
        coor.current[1] = Math.ceil(deltaY / 120) + coor.current[1];
      }
      // props.setPlc({ ...props.placement, [props.id.toString()]: coor.current });
      props.placement[props.id.toString()] = coor.current;
      props.getBiggestY();
    }
  };
  const nodeRef = useRef(null);
  let style = {
    top: props.top + "px",
    left: props.left + "px",
  };

  const handleConnect = () => {
    setSelectedJob(props.id);
    setShowMenu("connect");
  };

  const handleRemove = async () => {
    try {
      const response = await Axios.delete(`/workflow/template/${props.id}`);
      if (response.status === 200) {
        console.log("Job deleted");
      }
    } catch (error) {
      console.log(error);
    }
    setJobs(jobs.filter((job) => job.id !== props.id));
    delete props.placement[props.id.toString()];
    let jobConnections = connections[props.id.toString()];
    let jobDependencies = dependencies[props.id.toString()];
    if (jobConnections) {
      jobConnections.forEach(async (connection) => {
        let newDep = { [connection]: dependencies[connection]?.filter((job) => job !== props.id.toString()) };
        await Axios.post("/workflow/job/update", { jobId: parseInt(connection), successors: newDep[connection] });
        setDependencies({ ...dependencies, ...newDep });
      });
    }
    if (jobDependencies) {
      jobDependencies.forEach(async (dependency) => {
        let newConnection = { [dependency]: connections[dependency]?.filter((job) => job !== props.id.toString()) };
        await Axios.post("/workflow/job/update", { jobId: parseInt(dependency), successors: newConnection[dependency] });
        setConnections({ ...connections, ...newConnection });
      });
    }
    delete connections[props.id.toString()];
    setConnections((current) => {
      const { [props.id.toString()]: value, ...rest } = current;
      return rest;
    });
    setDependencies((current) => {
      const { [props.id.toString()]: value, ...rest } = current;
      return rest;
    });
    props.getBiggestY();
  };
  return (
    <>
      <Draggable
        grid={[170, 120]}
        onStart={setInitialCoordinates}
        bounds={"parent"}
        nodeRef={nodeRef}
        onDrag={updateXarrow}
        onStop={calculatePlacement}
        defaultPosition={{ x: props.left, y: props.top }}>
        <div
          ref={nodeRef}
          id={props.id.toString()}
          className={props.isSelected ? "created_job created_job_selected" : "created_job"}
          onClick={props.onClick}>
          <button onClick={handleConnect}>connect</button>
          <button onClick={handleRemove}>remove</button>
          {props.name}
          {props.id}
        </div>
      </Draggable>
    </>
  );
};

export default Job;
