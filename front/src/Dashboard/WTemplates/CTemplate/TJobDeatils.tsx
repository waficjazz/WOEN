import { useEffect, useState, useRef, ChangeEvent } from "react";
import * as api from "../api";
import Input from "../../../shared/Inputs/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../shared/Buttons/Button";
import { IJob, InputEvent, inputsParams, ITemplateParam, IWJob, outputsParams } from "../../../types";
import { useAtom } from "jotai";
import { aDepends, aJobs } from "../../../store";
import ReactTimeAgo from "react-time-ago";
import { dateStyle } from "../../../utils/time-format";

interface Props extends IJob {
  templateParams?: ITemplateParam[];
}
const TJobDetails = (props: Props) => {
  const [dependencies, setDependencies] = useAtom(aDepends);
  const [jobs, setJobs] = useAtom(aJobs);
  const [fullDependencies, setFullDependencies] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<IJob>({} as IJob);
  const [selectedOutput, setSelectedOutput] = useState<string>("");
  const [inputParamName, setInputParamName] = useState<string>("");
  const [option, setOption] = useState<number>(1);
  const [expression, setExpression] = useState<string[]>([props.condition || ""]);
  const [expValue, setExpValue] = useState("");
  const beforeParams = ["==", "!=", " ( ", " || ", " && "];
  const beforComb = [" ( ", "==", "!=", " && ", " || "];

  const handleExpValue = () => {
    const lastValue = expression[expression.length - 1];
    if (!beforeParams.includes(lastValue)) return;
    setExpression((prev) => [...prev, expValue]);
    setExpValue("");
  };

  const handleExpression = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const lastValue = expression[expression.length - 1];

    if (value == "") return;
    if (name === "params") {
      if (!beforeParams.includes(lastValue)) return;
    }
    if (name == "operator") {
      if (value == lastValue) return;
      if ((value == " || " || value == " && ") && beforComb.includes(lastValue)) return;
      if (value != " || " && value != " && " && value != "(" && [...beforComb, ")"].includes(lastValue)) return;
    }
    setExpression((prev) => [...prev, value]);
    e.target.value = "";
  };

  const selectedStyle = {
    borderBottom: "1px solid white ",
  };

  const updateJobOutputs = (id: number, outputs: outputsParams[]) => {
    let tmpJob = jobs;
    tmpJob = tmpJob.map((j) => {
      if (j.id === id) {
        j.outputParams = outputs;
        return j;
      }
      return j;
    });
    setJobs(tmpJob);
  };

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

  const [currentOutput, setCurrentOutput] = useState<outputsParams>({ name: "", path: "" } as outputsParams);
  const [outputs, setOutputs] = useState<outputsParams[]>([]);
  const [outputSubmit, setOutputSubmit] = useState<outputsParams[]>([]);
  const [inputs, setInputs] = useState<inputsParams[]>([]);

  const [inputSumbit, setInputSubmit] = useState<inputsParams[]>([]);

  const submitLocalInput = () => {
    setInputs((prev) => [...prev, { jobTemplateId: props.id, name: inputParamName, outputParamsId: parseInt(selectedOutput) }]);
    setInputSubmit((prev) => [...prev, { jobTemplateId: props.id, name: inputParamName, outputParamsId: parseInt(selectedOutput) }]);
    setInputParamName("");
    setSelectedJob({} as IJob);
    setSelectedOutput("");
  };

  const handleOutputsPair = (e: InputEvent) => {
    const { name, value } = e.target;
    if (name === "name") {
      setCurrentOutput((prev) => ({ ...prev, name: value, jobTemplateId: props.id } as outputsParams));
    }
    if (name === "path") {
      setCurrentOutput((prev) => ({ ...prev, path: value } as outputsParams));
    }
  };

  const handleOutSave = async () => {
    try {
      const response = await api.setOutParams(outputSubmit);
      if (response.status === 201) updateJobOutputs(props.id, response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCondSave = async () => {
    try {
      const response = await api.setCondition(props.id.toString(), expression.join(""));
      // if (response.status === 201) updateJobOutputs(props.id, response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInSave = async () => {
    try {
      const response = await api.setInParams(inputSumbit);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLocalOutput = () => {
    setCurrentOutput({ name: "", path: "" } as outputsParams);

    if (currentOutput?.name !== "" && currentOutput?.path !== "") {
      setOutputs((prev) => [...prev, currentOutput as outputsParams]);
      setOutputSubmit((prev) => [...prev, currentOutput as outputsParams]);
    }
  };
  useEffect(() => {
    const getJobInParams = async () => {
      try {
        const response = await api.getInParams(props.id);
        if (response.status === 200) setInputs(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getJobOutParams = async () => {
      try {
        const response = await api.getOutParams(props.id);
        if (response.status === 200) {
          setOutputs(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getJobOutParams();
    getJobInParams();
    return () => {
      setOutputs([]);
      setFullDependencies([]);
      setInputs([]);
    };
  }, [props.id]);
  const [inputPosition, setInputPosition] = useState({ left: 0, top: 0 });

  return (
    <div className="job_details_container">
      <div className="job_details_options">
        <div style={option === 1 ? selectedStyle : {}} className="tab" onClick={() => setOption(1)}>
          Template
        </div>
        <div style={option === 2 ? selectedStyle : {}} className="tab" onClick={() => setOption(2)}>
          Container
        </div>
        <div style={option === 3 ? selectedStyle : {}} className="tab" onClick={() => setOption(3)}>
          Input/Output
        </div>
      </div>

      {option === 1 && (
        <div className="job_details">
          <div>
            <label>NAME</label>
            <p>{props.name}</p>
          </div>
          <div>
            <label>CREATED</label>
            <p>{(props.createdAt && <ReactTimeAgo date={new Date(props.createdAt)} locale="en-US" timeStyle={dateStyle} />) || "-"}</p>
          </div>
        </div>
      )}
      {option === 2 && (
        <div className="job_details">
          <div>
            <label>NAME</label>
            <p>{props.container?.name}</p>
          </div>
          <div>
            <label>Image</label>
            <p>{props.container?.image}</p>
          </div>

          <div>
            <label>Commands</label>
            <div className="container_commands">
              {props.container?.commands &&
                props.container?.commands[2].split(";").map((c, i) => {
                  return <div key={c + i}>{c}</div>;
                })}
            </div>
          </div>
          <div>
            <label>CREATED</label>
            <p>
              {(props.container?.createdAt && <ReactTimeAgo date={new Date(props.container?.createdAt)} locale="en-US" timeStyle={dateStyle} />) ||
                "-"}
            </p>
          </div>
        </div>
      )}
      {option === 3 && (
        <div className="job_details">
          <div>
            <div>
              <div>
                <label>Inputs</label>
                {inputs.map((input, i) => {
                  return (
                    <div className="paramInptuContainer" key={input.id}>
                      <div>{input.name}</div>
                    </div>
                  );
                })}
                <div>
                  <Input label="name" name="name" onChange={(e) => setInputParamName(e.target.value)} />
                  <label>From</label>
                  <select onMouseDown={() => getAllDependencies(props.id.toString())} onChange={(e) => setSelectedJob(JSON.parse(e.target.value))}>
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
                <Button onClick={handleInSave}>Save</Button>
              </div>
              <div>
                <div>
                  <label>Outputs</label>
                  {outputs.map((output, i) => {
                    return (
                      <div className="paramInptuContainer" key={"name" + i}>
                        <Input label="name" defaultValue={output.name} disabled />
                        <Input label="path" defaultValue={output.path} disabled />
                      </div>
                    );
                  })}
                  <div className="paramInptuContainer">
                    <Input label="name" name="name" onChange={(e) => handleOutputsPair(e)} value={currentOutput.name} />
                    <Input label="path" name="path" onChange={(e) => handleOutputsPair(e)} value={currentOutput.path} />
                  </div>
                  <FontAwesomeIcon className="add_env_button" icon={faCirclePlus} onClick={handleLocalOutput} />
                </div>
                <div>
                  <Button onClick={handleOutSave}>Save</Button>
                </div>
                <div>
                  <Input label="Value" onChange={(e) => setExpValue(e.target.value)} value={expValue} />
                  <Button onClick={handleExpValue}>add</Button>
                  <select name="operator" onChange={(e) => handleExpression(e)}>
                    <option value="">Operator</option>
                    {[" ( ", " ) ", "==", "!=", " || ", " && "].map((inp) => {
                      return (
                        <option value={inp} key={inp}>
                          {inp}
                        </option>
                      );
                    })}
                  </select>
                  <select name="params" onChange={(e) => handleExpression(e)}>
                    <option value="">Input Param</option>
                    {inputs?.map((inp) => {
                      return (
                        <option value={"inputs." + inp.name} key={inp.name}>
                          {inp.name}
                        </option>
                      );
                    })}
                  </select>
                  <select name="params" onChange={(e) => handleExpression(e)}>
                    <option value="">Workflow Param</option>
                    {props.templateParams?.map((param) => {
                      return (
                        <option value={"workflow." + param.name} key={param.name}>
                          {param.name}
                        </option>
                      );
                    })}
                  </select>
                  <div>{expression}</div>
                </div>

                <div>
                  <Button onClick={handleCondSave}>Save</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TJobDetails;
