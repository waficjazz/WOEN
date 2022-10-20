import React, { useEffect, useState } from "react";
import Axios from "../../../axios";
import "./CWorkflow.css";
import SContainer from "./SContainer";

const CWorkflow = () => {
  interface SContainer {
    id: string;
    name: string;
    image: string;
    commands: string[];
  }

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
      {containres.map((container) => {
        return <SContainer id={container.id} key={container.id} name={container.name} image={container.image} />;
      })}
    </div>
  );
};

export default CWorkflow;
