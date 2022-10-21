import React, { useEffect, useState } from "react";
import Axios from "../../../axios";
import "./CWorkflow.css";
import SContainer from "./SContainer";
import { useAtom } from "jotai";
import { test } from "../../../store";
const CWorkflow = () => {
  interface SContainer {
    id: string;
    name: string;
    image: string;
    commands: string[];
  }
  const [count, setCount] = useAtom(test);

  const [containres, setContainers] = useState([] as SContainer[]);
  useEffect(() => {
    const getSavedContainers = async () => {
      try {
        const response = await Axios.get("/containers/saved");
        if (response.status === 200) {
          setContainers(response.data.containers);
        }
        // handle non 200 response
      } catch (error) {
        console.log(error); //handle error
      }
    };
    getSavedContainers();
  }, []);
  return (
    <div className="tools_list">
      <button onClick={() => setCount("jakk")}>click</button>
      {containres.map((container) => {
        return <SContainer id={container.id} key={container.id} name={container.name} image={container.image} />;
      })}
    </div>
  );
};

export default CWorkflow;
