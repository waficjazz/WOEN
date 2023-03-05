import React from "react";
import "./Input.css";

interface Props {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  name?: string;
  className?: string;
  label?: string;
  style?: any;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onFocus?: any;
  onBlur?: any;
}

const Input = ({ onChange, name, placeholder, className, label, style, value, defaultValue, disabled, onFocus, onBlur }: Props) => {
  return (
    <div className={"input_container " + className}>
      <label className="input_label">{label}</label>
      <input
        name={name}
        className="p_input "
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default Input;
