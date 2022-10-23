import { useEffect, useState } from "react";
import { ISContainer } from "../../types";
import Axios from "../../../axios";
import "./CWorkflow.css";
import SContainer from "./SContainer";

const CMenu = () => {
  const [containres, setContainers] = useState([] as ISContainer[]);

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
    <div className="c_menu" id="cmenu">
      <input />
      {containres.map((container) => {
        return <SContainer key={container.id} {...container} />;
      })}
    </div>
  );
};

export default CMenu;
