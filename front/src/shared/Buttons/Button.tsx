import React from "react";
import "./Button.css";

interface Props {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: any;
}

const Button = ({ children, onClick, style }: Props) => {
  return (
    <button className="p_button" onClick={onClick} style={style}>
      {children}
    </button>
  );
};

export default Button;
