import { useState } from "react";
import Button from "../../shared/Buttons/Button";
import Input from "../../shared/Inputs/Input";
import { ITemplateParam, IWorkflowParam } from "../../types";

interface Props {
  close: any;
  init: any;
  params: ITemplateParam[];
}
const SubmitForm = ({ close, init, params }: Props) => {
  const [workflowParams, setWorkflowParams] = useState<IWorkflowParam[]>([]);
  return (
    <div className="sumbit_form_container">
      <div>
        <button onClick={close}>close</button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            init(workflowParams);
          }}>
          Submit
        </Button>
      </div>
      <div>
        {params.map((param) => {
          return (
            <div key={param.name}>
              <Input label={param.name} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmitForm;
