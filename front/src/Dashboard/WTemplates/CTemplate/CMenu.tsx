import { useEffect, useState } from "react";
import { ISContainer } from "../../../types";
import Axios from "../../../axios";
import "./CTemplate.css";
import SContainer from "./SContainer";
import { aJobs, aShowMenu } from "../../../store";
import { useAtom } from "jotai";

const CMenu = () => {
  const [containres, setContainers] = useState([] as ISContainer[]);
  const [showMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  useEffect(() => {
    const getSavedContainers = async () => {
      try {
        const response = await Axios.get("/containers/saved");
        if (response.status === 200) {
          setContainers(response.data);
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
      {showMenu == "connect" &&
        jobs.map((job: ISContainer) => {
          return <SContainer key={job.id} {...job} />;
        })}
      {showMenu == "add" &&
        containres.map((container) => {
          return <SContainer key={container.id} {...container} />;
        })}
    </div>
  );
};

export default CMenu;
