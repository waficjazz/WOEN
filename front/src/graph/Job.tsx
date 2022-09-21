import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import "./graph.css";
type Props = {
  id: string;
  st: any;
  cp: any;
  time: number;
  setShowCp: any;
  registerTime: any;
  showCp: boolean;
  className: string;
};

type CM = {
  a: string;
  b: string;
};
const ContextMenu = ({ a, b }: CM) => {
  console.log(a, b);
  let style = { top: a + "px", left: b + "px" };
  return (
    <div className="contextMenu" style={style}>
      hello world
    </div>
  );
};

const Job = ({ id, st, cp, setShowCp, time, showCp, registerTime, className }: Props) => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [showContextMenu, setShowContextMenu] = useState(false);
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
    <>
      {/* <div
        onContextMenu={(e) => {
          e.preventDefault();
          setShowContextMenu(true);
          setA(e.clientY.toString());
          setB(e.clientX.toString());
        }}> */}
      <Draggable onDrag={updateXarrow} onStop={updateXarrow} bounds="parent">
        <div
          id={id}
          className={className}
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
      {/* {showContextMenu && <ContextMenu a={a} b={b} />} */}
      {/* </div> */}
    </>
  );
};

export default Job;
