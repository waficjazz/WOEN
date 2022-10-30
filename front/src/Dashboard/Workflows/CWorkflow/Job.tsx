import { useEffect, useCallback, useState, useRef } from "react";
import { useAtom } from "jotai";
import { IJob, IPlacement } from "../../types";
import { aShowMenu, aSelectedJob } from "../../../store";
import { useXarrow } from "react-xarrows";
import { aJobs } from "../../../store";

import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from "react-draggable";

interface IProps extends IJob {
  placement: IPlacement;
  getBiggestY: () => void;
  top: number;
  left: number;
}

const Job = (props: IProps) => {
  const coor = useRef(props.placement[props.id]);
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
      props.placement[props.id] = coor.current;
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

  const handleRemove = () => {
    setJobs(jobs.filter((job) => job.id !== props.id));
    delete props.placement[props.id];
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
        <div ref={nodeRef} id={props.id} className="created_job">
          <button onClick={handleConnect}>connect</button>
          <button onClick={handleRemove}>remove</button>
          {props.name.substring(1)}
        </div>
      </Draggable>
    </>
  );
};

export default Job;
