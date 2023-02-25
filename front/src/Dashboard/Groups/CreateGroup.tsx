import { useState } from "react";
import Button from "../../shared/Buttons/Button";
import Input from "../../shared/Inputs/Input";
import { InputEvent, IGroup } from "../../types";
import * as api from "./api";
interface Props {
  show: boolean;
  close: any;
}
const CreateGroup = ({ show, close }: Props) => {
  const [group, setGroup] = useState<IGroup>();

  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setGroup((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    try {
      const response = await api.createGroup(group);
      if (response.status == 201) close(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container_form">
        <div>
          <Input label="Name" name="name" onChange={handleChange} />
          <Input label="Description" name="description" onChange={handleChange} />
          <Button onClick={submit}>submit</Button>
        </div>
      </div>
    </>
  );
};

export default CreateGroup;
