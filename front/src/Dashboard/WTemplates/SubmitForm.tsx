import { useEffect, useState } from "react";
import Button from "../../shared/Buttons/Button";
import Input from "../../shared/Inputs/Input";
import { InputEvent, ITemplateParam, IWorkflowParam } from "../../types";

interface Props {
  close: any;
  init: any;
  params: ITemplateParam[];
}
const SubmitForm = ({ close, init, params }: Props) => {
  const [workflowParams, setWorkflowParams] = useState<IWorkflowParam[]>([]);
  const [currentParam, setCurrentParam] = useState<IWorkflowParam>({ name: "", value: "" });
  const handleParams = (e: InputEvent) => {
    const { value } = e.target;
    setCurrentParam((prev) => ({ ...prev, value }));
  };

  const handleFocus = (e: InputEvent) => {
    const { name, value } = e.target;
    setCurrentParam({ name, value });
  };
  const handleBlur = (e: InputEvent) => {
    const { name } = e.target;
    let arr = workflowParams;
    const index = arr.findIndex((item) => item.name === name);
    if (index !== -1) arr[index] = currentParam;
    if (index === -1) arr.push(currentParam);
    setWorkflowParams(arr);
  };

  useEffect(() => {
    let arr = params.map((param) => {
      return { name: param.name, value: param.default || "" };
    });
    setWorkflowParams(arr);
  }, []);
  return (
    <div className="sumbit_form_container" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
      <div>
        <button onClick={close}>close</button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            console.log(workflowParams);
            // init(workflowParams);
          }}>
          Submit
        </Button>
      </div>
      <div>
        {params.map((param) => {
          return (
            <div key={param.name}>
              <Input
                label={param.name}
                onChange={(e) => handleParams(e)}
                name={param.name}
                onFocus={(e: InputEvent) => handleFocus(e)}
                onBlur={(e: InputEvent) => handleBlur(e)}
                defaultValue={param.default}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmitForm;
