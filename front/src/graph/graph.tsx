import React, { useState, useEffect } from "react";
import init from "wasm-lib";

const graph = () => {
  const [data, setData] = useState();
  const [twoWatData, setTwoWayData] = useState();
  const [dataLevels, setDataLevels] = useState();
  const [file, setFile] = useState<String>("");

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

  return <div className=""></div>;
};

export default graph;
