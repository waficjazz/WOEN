import React from "react";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import "./graph.css";
type Props = {
  id: string;
  st: any;
  cp: any;
  time: number;
};

const Job = ({ id, st, cp, time }: Props) => {
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
        <br />
        {time}
      </div>
    </Draggable>
  );
};

export default Job;
