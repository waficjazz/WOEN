import React from "react";
import "./Input.css";

interface Props {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  name?: string;
  className?: string;
  label?: string;
  style?: any;
}

const Input = ({ onChange, name, placeholder, className, label, style }: Props) => {
  return (
    <div className={"input_container " + className}>
      <label className="input_label">{label}</label>
      <input name={name} className="p_input " onChange={onChange} placeholder={placeholder} />
    </div>
  );
};

export default Input;
