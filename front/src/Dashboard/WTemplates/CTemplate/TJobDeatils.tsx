import { useEffect, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ThreeDots } from "react-loader-spinner";
import * as api from "../api";
import Input from "../../../shared/Inputs/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../shared/Buttons/Button";
import { InputEvent } from "../../../types";
const TJobDetails = (props: any) => {
  interface outputsPair {
    jobTemplateId: number;
    name: string;
    path: string;
  }
  const [outputs, setOutputs] = useState<outputsPair[]>([]);

  const handleOutputsPair = (e: InputEvent, i: number) => {
    const { name, value } = e.target;
    let arr = outputs;
    if (name === "name") arr[i].name = value;
    if (name === "path") arr[i].path = value;
    setOutputs(arr);
  };

  const handleSave = async () => {
    try {
      console.log(outputs);
      const response = await api.setOutParams(outputs);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const getJobParams = async () => {
      try {
        const response = await api.getOutParams(props.id);
        if (response.status === 200) setOutputs(response.data);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getJobParams();
    return () => {
      setOutputs([]);
    };
  }, [props.id]);
  return (
    <div className="job_details_container">
      <div className="job_details_options">
        <div className="job_details">
          <div>
            <label>NAME</label>
            <p>{props.name}</p>
          </div>
          <div>
            <div>
              <label>Outputs</label>
              {outputs.map((output, i) => {
                return (
                  <>
                    <Input label="name" name="name" defaultValue={output.name} onChange={(e) => handleOutputsPair(e, i)} key={"name" + i} />
                    <Input label="path" name="path" defaultValue={output.path} onChange={(e) => handleOutputsPair(e, i)} key={"path" + i} />
                  </>
                );
              })}
              <FontAwesomeIcon
                className="add_env_button"
                icon={faCirclePlus}
                onClick={() => {
                  const addOutput = () => setOutputs([...outputs, { jobTemplateId: props.id, name: "", path: "" }]);
                  if (outputs.length > 0) {
                    const last = outputs[outputs.length - 1];
                    if (last.name !== "" && last.path !== "") {
                      addOutput();
                    }
                  } else addOutput();
                }}
              />
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TJobDetails;
