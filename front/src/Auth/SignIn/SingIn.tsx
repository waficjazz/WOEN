import { useEffect, useState } from "react";
import Button from "../../shared/Buttons/Button";
import Input from "../../shared/Inputs/Input";
import { InputEvent, ISignIn } from "../../types";
import { updateUser } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import Axios from "../../axios";
import * as api from "../api";

const SingIn = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ISignIn>({} as ISignIn);
  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const signIn = async () => {
    try {
      const { data, status } = await api.userSignIn(user);
      if (status === 201) {
        Axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        updateUser(data.token, data.user);
        navigate("/projects");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="reg_container">
      <Input className="reg_input_lg" label="UserName or Email" name="user" onChange={handleChange} />
      <Input className="reg_input_lg" label="Password" name="password" onChange={handleChange} />
      <Button onClick={signIn}>sing in</Button>
    </div>
  );
};

export default SingIn;
