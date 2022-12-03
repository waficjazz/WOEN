import React from "react";
import Input from "../../shared/Inputs/Input";
import "./SignUp.css";
const SignUp = () => {
  return (
    <div className="signup_container">
      <Input className="signup_input" label="First Name" />
      <Input className="signup_input" label="Last Name" />
      <Input className="signup_input_lg" label="Email" />
      <Input className="signup_input_lg" label="Password" />
      <Input className="signup_input_lg" label="Confirm Password" />
    </div>
  );
};

export default SignUp;
