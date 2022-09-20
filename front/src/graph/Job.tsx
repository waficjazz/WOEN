import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import "./graph.css";
type Props = {
  id: string;
  st: any;
  cp: any;
  time: number;
  registerTime: any;
};
const Job = ({ id, st, cp, time, registerTime }: Props) => {
  const [timing, setTiming] = useState(1);
  useEffect(() => {
    if (time !== undefined) {
      setTiming(time);
    } else {
      registerTime(id, 1);
    }
  }, [time]);
  useEffect(() => {
    registerTime(id, timing);
  }, [timing]);
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow} bounds="parent">
      <div
        id={id}
        className="job"
        style={st}
        onClick={() => {
          cp(id);
        }}>
        {id}
        <br />
        <input
          className="time_input"
          type="text"
          value={timing}
          onChange={(e) => {
            if (e.target.value === "") {
              setTiming(0);
            } else {
              setTiming(parseInt(e.target.value));
            }
          }}
        />
      </div>
    </Draggable>
  );
};

export default Job;
