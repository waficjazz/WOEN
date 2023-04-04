import React, { Children } from "react";
import "./Select.css";

interface Props {
  children: React.ReactNode;
  onMouseDown?: React.MouseEventHandler<HTMLSelectElement>;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  name?: string;
  style?: any;
  disabled?: boolean;
}
export const Select = ({ children, onMouseDown, onChange, name }: Props) => {
  return (
    <select className="select" onMouseDown={onMouseDown} name={name} onChange={onChange}>
      {children}
    </select>
  );
};
