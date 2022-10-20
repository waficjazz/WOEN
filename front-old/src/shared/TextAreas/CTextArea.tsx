import React from "react";
import "./textArea.css";

interface Props {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  name?: string;
  value?: string;
  id?: string;
}
const CTextArea = ({ onKeyUp, placeholder, value, name, onChange, id }: Props) => {
  return <textarea id={id} value={value} className="CText_area" placeholder={placeholder} name={name} onChange={onChange} onKeyUp={onKeyUp} />;
};

export default CTextArea;
