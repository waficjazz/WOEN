import React, { useState, useEffect } from "react";
import init, { get_two_way, get_one_way } from "wasm-lib";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Job from "./Job";
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

  const [node, setNode] = useState<Node>();
  const [data, setData] = useState<Data>();
  const [twoWayData, setTwoWayData] = useState<Data>();
  const [dataLevels, setDataLevels] = useState();
  const [file, setFile] = useState<string>("");
  const [cp, setCp] = useState<string[]>([]);
  let criticalPath: string[] = [];

  let times: Time = {
    a: 2,
    b: 52,
    c: 15,
    d: 6,
    e: 5,
    f: 3,
    k: 11,
    l: 4,
    g: 2,
    m: 4,
  };

  function getCriticalPath(job: string): string[] {
    let longestJob: string = "";
    let longestTime = 0;
    let prevJobs: string[] = [];
    if (twoWayData !== undefined && twoWayData.hasOwnProperty(job)) {
      prevJobs = twoWayData[job].filter((e: string) => {
        return /p_[a-z0-9]+/.test(e);
      });
    }
    prevJobs = prevJobs.map((e: string) => {
      e = e.slice(2);
      return e;
    });
    console.log(prevJobs);
    if (prevJobs.length === 0) {
      setCp(criticalPath);
      console.log(criticalPath);
      return criticalPath;
    }
    prevJobs.forEach((prevJob: string) => {
      if (times[prevJob] > longestTime) {
        longestJob = prevJob;
      }
    });
    console.log(longestJob);
    criticalPath.push(longestJob);
    return getCriticalPath(longestJob);
  }

  let levels: any = { 0: ["a"] };
  useEffect(() => {
    getl("a");
    console.log(twoWayData);
    console.log(data);
    getCriticalPath("h");
  }, [data, twoWayData]);

  useEffect(() => {
    readTextFile("input.txt");
  }, []);

  useEffect(() => {
    init().then(() => {
      setData(JSON.parse(get_one_way(file)));
      setTwoWayData(JSON.parse(get_two_way(file)));
    });
  }, [file]);

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
    console.log(nextLevel);
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
    console.log(levels);
    return levels;
  }

  return (
    <div className="grapth_container">
      <Xwrapper>
        {node &&
          Object.keys(node).map((key) => {
            return (
              <>
                {node[key].map((item: string) => {
                  let h = parseInt(key) * 100;
                  let w = node[key].indexOf(item) * 145;
                  let st = { top: h + "px", left: w + "px" };
                  return (
                    <>
                      <Job id={item} st={st} cp={getCriticalPath} />
                      {node[parseInt(key) - 1] !== undefined &&
                        twoWayData &&
                        twoWayData[item]
                          .filter((e: string) => {
                            return /p_[a-z0-9]+/.test(e);
                          })
                          .map((e: string) => {
                            let a = e.slice(2);
                            return <Xarrow start={a} end={item} curveness={0.5} startAnchor={"bottom"} endAnchor={"top"} color={"white"} strokeWidth={1} />;
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
              return <Xarrow start={e} end={cp[cp.indexOf(e) + 1]} curveness={0.5} startAnchor={"top"} endAnchor={"bottom"} color={"red"} strokeWidth={2} />;
            }
          })}
      </Xwrapper>
    </div>
  );
};

export default Graph;
