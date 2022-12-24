import React from "react";
import "./Button.css";

interface Props {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: any;
  disabled?: boolean;
}

const Button = ({ children, onClick, style, disabled }: Props) => {
  return (
    <button className="p_button" onClick={onClick} style={style} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
