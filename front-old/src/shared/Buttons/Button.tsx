import React from "react";
import "./Button.css";

interface Props {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ children, onClick }: Props) => {
  return (
    <button className="p_button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
