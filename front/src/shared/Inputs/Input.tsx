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
  ref?: any;
  onKeyDown?: any;
}

const Input = ({ onChange, name, placeholder, className, label, style, value, defaultValue, disabled, onFocus, onBlur, onKeyDown, ref }: Props) => {
  return (
    <div className={"input_container " + className}>
      <label className="input_label">{label}</label>
      <input
        onKeyDown={onKeyDown}
        name={name}
        className="p_input "
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={ref}
      />
    </div>
  );
};

export default Input;
