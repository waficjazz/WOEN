import React from "react";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import "./graph.css";
type Props = {
  id: string;
  st: any;
  cp: any;
};

const Job = ({ id, st, cp }: Props) => {
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div
        id={id}
        className="job"
        style={st}
        onClick={() => {
          cp(id);
        }}>
        {id}
      </div>
    </Draggable>
  );
};

export default Job;
