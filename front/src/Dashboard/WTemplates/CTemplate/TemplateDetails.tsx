import { useEffect, useState } from "react";
import * as api from "../api";
import Input from "../../../shared/Inputs/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../shared/Buttons/Button";
import { IWTemplate } from "../../../types";
import { useAtom } from "jotai";
import { aDepends, aJobs } from "../../../store";
import ReactTimeAgo from "react-time-ago";
import { dateStyle } from "../../../utils/time-format";
const TemplateDetails = (props: IWTemplate) => {
  const [dependencies, setDependencies] = useAtom(aDepends);
  const [jobs, setJobs] = useAtom(aJobs);
  const [currentParam, setCurrentParam] = useState<any>();

  const [option, setOption] = useState<number>(1);

  const selectedStyle = {
    borderBottom: "1px solid white ",
  };

  return (
    <div className="template_details_container">
      <div className="job_details_options">
        <div style={option === 1 ? selectedStyle : {}} className="tab" onClick={() => setOption(1)}>
          Details
        </div>
        <div style={option === 2 ? selectedStyle : {}} className="tab" onClick={() => setOption(2)}>
          Parameters
        </div>
      </div>
      {option === 1 && (
        <div className="job_details">
          <div>
            <label>Name</label>
            <p>{props.name}</p>
          </div>
          <div>
            <label>OWNER</label>
            <p>{props.owner}</p>
          </div>
          <div>
            <label>CREATED</label>
            <p>{(props?.createdAt && <ReactTimeAgo date={new Date(props?.createdAt)} locale="en-US" timeStyle={dateStyle} />) || "-"}</p>
          </div>
        </div>
      )}
      {option === 2 && <div className="job_details"></div>}
    </div>
  );
};

export default TemplateDetails;
