import React, { useState } from "react";
import { InputEvent, IUser } from "../../types";
import Input from "../../shared/Inputs/Input";
import "./SignUp.css";
import Axios from "../../axios";
import Button from "../../shared/Buttons/Button";
const SignUp = () => {
  const [user, setUser] = useState<IUser>({} as IUser);
  const handleChange = (e: InputEvent) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const signUp = async () => {
    try {
      console.log(user);
      const response = await Axios.post("/user/signup", user);
      if (response.status === 201) console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="signup_container">
      <Input className="signup_input" label="First Name" name="firstName" onChange={handleChange} />
      <Input className="signup_input" label="Last Name" name="lastName" onChange={handleChange} />
      <Input className="signup_input_lg" label="UserName" name="username" onChange={handleChange} />
      <Input className="signup_input_lg" label="Email" name="email" onChange={handleChange} />
      <Input className="signup_input_lg" label="Password" name="password" onChange={handleChange} />
      <Input className="signup_input_lg" label="Confirm Password" name="confirmPassword" onChange={handleChange} />
      <Button onClick={signUp}>signup</Button>
    </div>
  );
};

export default SignUp;
