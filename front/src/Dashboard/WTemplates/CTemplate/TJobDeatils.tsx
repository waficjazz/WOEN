import { useEffect, useState } from "react";
import * as api from "../api";
import Input from "../../../shared/Inputs/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../shared/Buttons/Button";
import { IJob, InputEvent, inputsParams, outputsParams } from "../../../types";
import { useAtom } from "jotai";
import { aDepends, aJobs } from "../../../store";
const TJobDetails = (props: any) => {
  const [dependencies, setDependencies] = useAtom(aDepends);
  const [jobs, setJobs] = useAtom(aJobs);
  const [fullDependencies, setFullDependencies] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<IJob>({} as IJob);
  const [selectedOutput, setSelectedOutput] = useState<string>("");
  const [inputParamName, setInputParamName] = useState<string>("");
  function getAllDependencies(key: string, reachableKeys: string[] = []) {
    if (!dependencies.hasOwnProperty(key)) {
      return reachableKeys;
    }
    const keys = dependencies[key];
    if (!keys) return reachableKeys;
    reachableKeys.push(...keys);
    keys.forEach((k) => {
      getAllDependencies(k, reachableKeys);
    });
    setFullDependencies(Array.from(new Set(reachableKeys)));
  }

  const [outputs, setOutputs] = useState<outputsParams[]>([]);
  const [inputs, setInputs] = useState<inputsParams[]>([]);

  const submitLocalInput = () => {
    setInputs((prev) => [...prev, { name: inputParamName, from: selectedJob.id, output: parseInt(selectedOutput) }]);
    setInputParamName("");
    setSelectedJob({} as IJob);
    setSelectedOutput("");
  };

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
      } catch (err) {
        console.log(err);
      }
    };
    getJobParams();
    return () => {
      setOutputs([]);
      setFullDependencies([]);
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
              <label>Inputs</label>
              {inputs.map((input, i) => {
                return (
                  <div className="paramInptuContainer">
                    <div>from</div>
                    <div>output</div>
                  </div>
                );
              })}
              <div>
                <Input label="name" name="name" onChange={(e) => setInputParamName(e.target.value)} />
                <label>From</label>
                <select onMouseDown={() => getAllDependencies(props.id)} onChange={(e) => setSelectedJob(JSON.parse(e.target.value))}>
                  <option>Select a job</option>
                  {fullDependencies.map((dep) => {
                    const job = jobs.find((job) => job.id === parseInt(dep));
                    if (job)
                      return (
                        <option value={JSON.stringify(job)} key={job.id}>
                          {job.name}
                        </option>
                      );
                  })}
                </select>
                <label>Output</label>
                <select onChange={(e) => setSelectedOutput(e.target.value)}>
                  <option>Select job output</option>
                  {selectedJob?.outputParams?.map((param) => {
                    return (
                      <option value={param.id} key={param.name}>
                        {param.name}
                      </option>
                    );
                  })}
                </select>
                <FontAwesomeIcon className="add_env_button" icon={faCirclePlus} onClick={submitLocalInput} />
              </div>

              <label>Outputs</label>
              {outputs.map((output, i) => {
                return (
                  <div className="paramInptuContainer">
                    <Input label="name" name="name" defaultValue={output.name} onChange={(e) => handleOutputsPair(e, i)} key={"name" + i} />
                    <Input label="path" name="path" defaultValue={output.path} onChange={(e) => handleOutputsPair(e, i)} key={"path" + i} />
                  </div>
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
