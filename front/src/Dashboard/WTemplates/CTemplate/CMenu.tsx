import { useEffect, useState } from "react";
import { ISContainer } from "../../../types";
import "./CTemplate.css";
import SContainer from "./SContainer";
import { aJobs, aShowMenu, aSelectedJob, aProject } from "../../../store";
import { useAtom } from "jotai";
import * as api from "../api";
const CMenu = () => {
  const [project, setProject] = useAtom(aProject);
  const [containres, setContainers] = useState([] as ISContainer[]);
  const [showMenu] = useAtom(aShowMenu);
  const [jobs, setJobs] = useAtom(aJobs);
  const [selectedJob] = useAtom(aSelectedJob);

  useEffect(() => {
    const getSavedContainers = async () => {
      try {
        const response = await api.getSavedContainers(project.id || 0);
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
          if (job.id === selectedJob) return;
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
