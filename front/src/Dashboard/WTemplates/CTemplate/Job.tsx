import { useEffect, useCallback, useState, useRef } from "react";
import { useAtom } from "jotai";
import { IJob, IPlacement } from "../../../types";
import { aShowMenu, aSelectedJob, aConnect, aDepends } from "../../../store";
import { useXarrow } from "react-xarrows";
import { aJobs } from "../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCircle } from "@fortawesome/free-solid-svg-icons";
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from "react-draggable";

interface IProps extends IJob {
  placement: IPlacement;
  getBiggestY: () => void;
  top: number;
  left: number;
  isSelected: boolean;
  onClick: any;
  remove: any;
}

const Job = (props: IProps) => {
  const coor = useRef(props.placement[props.id.toString()]);
  const updateXarrow = useXarrow();
  const [, setShowMenu] = useAtom(aShowMenu);
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
  // let style = {
  //   top: props.top + "px",
  //   left: props.left + "px",
  // };

  const handleConnect = () => {
    setSelectedJob(props.id);
    setShowMenu("connect");
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
          <div className="template_job_name">
            {props.name}
            <FontAwesomeIcon icon={faXmark} size="lg" className="job_remove_icon" onClick={() => props.remove(props.id)} />
          </div>
          <FontAwesomeIcon icon={faCircle} size="sm" className="job_link_icon job_link_icon_top " onClick={handleConnect} />
          <FontAwesomeIcon icon={faCircle} size="sm" className="job_link_icon job_link_icon_bottom " onClick={handleConnect} />
        </div>
      </Draggable>
    </>
  );
};

export default Job;
