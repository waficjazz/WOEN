import { useEffect, useCallback, useState, useRef } from "react";
import { useAtom } from "jotai";
import { IJob } from "../../types";
import { aShowMenu, aSelectedJob } from "../../../store";
import { useXarrow } from "react-xarrows";

import Draggable from "react-draggable";

interface IProps extends IJob {
  top?: number;
  left?: number;
}

const Job = (props: IProps) => {
  const updateXarrow = useXarrow();
  const [, setShowMenu] = useAtom(aShowMenu);
  const [, setSelectedJob] = useAtom(aSelectedJob);

  const nodeRef = useRef(null);
  let style = {
    top: props.top + "px",
    left: props.left + "px",
  };

  const handleConnect = () => {
    setSelectedJob(props.id);
    setShowMenu("connect");
  };

  return (
    <>
      <Draggable grid={[170, 120]} bounds={"parent"} nodeRef={nodeRef} onDrag={updateXarrow} onStop={updateXarrow}>
        <div ref={nodeRef} id={props.id} className="created_job" style={style}>
          <button onClick={handleConnect}>connect</button>
          {props.name.substring(1)}
        </div>
      </Draggable>
    </>
  );
};

export default Job;
