import React from "react";
import "./Input.css";

interface Props {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  name?: string;
}

const Input = ({ onChange, name, placeholder }: Props) => {
  return <input name={name} className="p_input" onChange={onChange} placeholder={placeholder} />;
};

export default Input;
