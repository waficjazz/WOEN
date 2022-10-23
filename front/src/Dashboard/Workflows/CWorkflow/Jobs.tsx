import { useEffect, useCallback, useState, useRef } from "react";
import { useAtom } from "jotai";
import { IJob } from "../../types";
import Draggable from "react-draggable";

const Jobs = (props: IJob) => {
  const nodeRef = useRef(null);

  return (
    <>
      <Draggable grid={[120, 120]} bounds={"parent"} nodeRef={nodeRef}>
        <div ref={nodeRef} id={props.id} className="created_job" about="job">
          {props.name.substring(1)}
        </div>
      </Draggable>
    </>
  );
};

export default Jobs;
