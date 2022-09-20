import React, { useState, useEffect } from "react";
import init, { get_two_way, get_one_way } from "wasm-lib";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Job from "./Job";
import { time } from "console";
const Graph = () => {
  interface Node {
    [key: string]: string[];
  }
  interface Data {
    [key: string]: string[];
  }
  interface Time {
    [key: string]: number;
  }
  let cpDepth = 0;
  let firstJob = "";
  const [inp, setInp] = useState("");
  const [timesInput, setTimesInput] = useState("");
  const [dataInput, setDataInput] = useState("");
  const [node, setNode] = useState<Node>();
  const [data, setData] = useState<Data>();
  const [twoWayData, setTwoWayData] = useState<Data>();
  const [dataLevels, setDataLevels] = useState();
  const [file, setFile] = useState<string>("");
  const [cp, setCp] = useState<string[]>([]);
  const [times, setTimes] = useState<Time>({ a: 1 });
  let criticalPath: string[] = [];
  let a = -1;
  let count = 0;
  let place = 1;

  function registerTime(job: string, time: number) {
    setTimes((prev) => {
      return { ...prev, [job]: time };
    });
  }

  function getCriticalPath(job: string): string[] {
    let longestJob: string = "";
    let longestTime = 0;
    let prevJobs: string[] = [];
    if (cpDepth === 0) firstJob = job;
    cpDepth++;
    if (twoWayData !== undefined && twoWayData.hasOwnProperty(job)) {
      prevJobs = twoWayData[job].filter((e: string) => {
        return /p_[a-z0-9]+/.test(e);
      });
    }
    prevJobs = prevJobs.map((e: string) => {
      e = e.slice(2);
      return e;
    });
    if (prevJobs.length === 0) {
      criticalPath.unshift(firstJob);
      setCp(criticalPath);
      return criticalPath;
    }
    prevJobs.forEach((prevJob: string) => {
      if (times[prevJob] > longestTime) {
        longestJob = prevJob;
        longestTime = times[prevJob];
      }
    });
    criticalPath.push(longestJob);
    return getCriticalPath(longestJob);
  }

  let levels: any = { 0: ["a"] };
  useEffect(() => {
    getl("a");
    // getCriticalPath("h");
  }, [data, twoWayData]);

  useEffect(() => {
    init().then(() => {
      setData(JSON.parse(get_one_way(dataInput)));
      setTwoWayData(JSON.parse(get_two_way(dataInput)));
    });
  }, [dataInput, times]);

  function handleTimesInput(e: string) {
    const arr = e.split("\n");
    let obj: Time = {};
    arr.forEach((e) => {
      let temp = e.split(":");
      obj[temp[0]] = parseInt(temp[1]);
    });
    setTimes(obj);
    console.log(obj);
  }

  function readTextFile(file: string) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          setFile(allText);
          return allText.toString();
        }
      }
    };
    rawFile.send(null);
  }

  function getl(root: string) {
    if (root === null) return 0;
    let tmp: string[] = [];
    let i = 0;
    let nextLevel: string[] = [];
    nextLevel = nextLevel.concat(["a"]);
    while (nextLevel.length > 0) {
      tmp = [];
      i++;
      nextLevel.forEach((element) => {
        if (data === undefined) return 0;
        if (data[element] !== undefined) {
          tmp = tmp.concat(data[element]);
        }
      });
      levels[i] = [...new Set(tmp)];
      nextLevel = tmp;
    }
    setNode({ ...levels });
    return levels;
  }

  return (
    <div className="parent_container">
      <div className="input_container">
        <div className="relations_container">
          <textarea
            placeholder="Example:a>b"
            value={inp}
            onChange={(e) => {
              setInp(e.target.value);
            }}
            className="timeI"
          />
          <br />
          <button onClick={() => setDataInput(inp)}>submit</button>
        </div>
        <div className="relations_container">
          <textarea
            placeholder="Example:a:4"
            value={timesInput}
            onChange={(e) => {
              setTimesInput(e.target.value);
            }}
            className="timeI"
          />
          <br />
          <button onClick={() => handleTimesInput(timesInput)}>update timings</button>
        </div>
      </div>
      <div className="grapth_container">
        <Xwrapper>
          {node &&
            Object.keys(node).map((key) => {
              count = 0;
              place = 0;
              return (
                <>
                  {node[key].map((item: string) => {
                    a = a * -1;
                    let h = (parseInt(key) + 0.5) * 100;
                    let w = a * 100;
                    count++;

                    if (count % 2 === 0) {
                      place++;
                    }
                    w = place * 145 * a;

                    let st = { top: h + "px", left: "calc(50% + " + w + "px )" };
                    return (
                      <>
                        <Job id={item} st={st} cp={getCriticalPath} time={times[item]} registerTime={registerTime} />
                        {node[parseInt(key) - 1] !== undefined &&
                          twoWayData !== undefined &&
                          twoWayData[item] !== undefined &&
                          twoWayData[item]
                            .filter((e: string) => {
                              return /p_[a-z0-9]+/.test(e);
                            })
                            .map((e: string) => {
                              let a = e.slice(2);
                              if (a !== undefined)
                                return (
                                  <Xarrow start={a} end={item} curveness={0.5} startAnchor={"bottom"} endAnchor={"top"} color={"white"} strokeWidth={1} animateDrawing={0.5} />
                                );
                            })}
                      </>
                    );
                  })}
                </>
              );
            })}
          {cp !== undefined &&
            cp.map((e: string) => {
              if (cp.indexOf(e) !== cp.length - 1) {
                return <Xarrow start={e} end={cp[cp.indexOf(e) + 1]} curveness={0.5} startAnchor={"top"} endAnchor={"bottom"} color={"red"} strokeWidth={2} animateDrawing={0.5} />;
              }
            })}
        </Xwrapper>
      </div>
    </div>
  );
};

export default Graph;
