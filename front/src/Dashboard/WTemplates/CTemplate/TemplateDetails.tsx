import { useEffect, useState } from "react";
import * as api from "../api";
import Input from "../../../shared/Inputs/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../shared/Buttons/Button";
import { InputEvent, ITemplateParam, IWTemplate } from "../../../types";
import { useAtom } from "jotai";
import { aDepends, aJobs } from "../../../store";
import ReactTimeAgo from "react-time-ago";
import { dateStyle } from "../../../utils/time-format";
const TemplateDetails = (props: IWTemplate) => {
  const [dependencies, setDependencies] = useAtom(aDepends);
  const [jobs, setJobs] = useAtom(aJobs);
  const [currentParam, setCurrentParam] = useState<ITemplateParam>({ name: "", default: "", required: false, workflowTemplateId: props.id });
  const [params, setParams] = useState<ITemplateParam[]>([]);
  const [option, setOption] = useState<number>(1);

  const selectedStyle = {
    borderBottom: "1px solid white ",
  };

  const handleSubmitParams = async () => {
    try {
      console.log(params);
      const response = await api.addWorkflowParam(params);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddParams = () => {
    if (currentParam.name !== "" && currentParam.default !== "") {
      setParams((prev) => [...prev, currentParam]);
      setCurrentParam({ name: "", default: "", required: false, workflowTemplateId: props.id });
    }
  };

  const handleParam = (e: InputEvent) => {
    const { name, value } = e.target;
    setCurrentParam((prev) => ({ ...prev, [name]: value }));
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
            <p>{props.owner?.username}</p>
          </div>
          <div>
            <label>CREATED</label>
            <p>{(props?.createdAt && <ReactTimeAgo date={new Date(props?.createdAt)} locale="en-US" timeStyle={dateStyle} />) || "-"}</p>
          </div>
        </div>
      )}
      {option === 2 && (
        <div className="job_details">
          <div>
            {[...props.parameters!!, ...params].map((param) => {
              return (
                <div key={param.name}>
                  <div>{param.name}</div>
                  <div>{param.default}</div>
                  <div>{param.required}</div>
                </div>
              );
            })}
          </div>
          <div className="">
            <Input name="name" label="Name" onChange={(e) => handleParam(e)} value={currentParam.name} />
            <Input name="default" label="Default Value" onChange={(e) => handleParam(e)} value={currentParam.default} />
          </div>
          <FontAwesomeIcon className="add_env_button" icon={faCirclePlus} onClick={handleAddParams} />
          <Button onClick={handleSubmitParams}>Save</Button>
        </div>
      )}
    </div>
  );
};

export default TemplateDetails;
