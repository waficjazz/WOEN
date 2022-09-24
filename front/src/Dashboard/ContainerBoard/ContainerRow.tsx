import React from "react";
import { BsBoxSeam } from "react-icons/bs";

interface Props {
  name: string;
  image: string;
  status: string;
}

const ContainerRow = ({ name, status, image }: Props) => {
  function setColor(status: string) {
    switch (status) {
      case "Running":
        return "green";
      case "Created":
        return "red";
      default:
        return "grey";
    }
  }
  return (
    <div className="container_row">
      <BsBoxSeam size={20} color={setColor(status)} />
      <div className="container_row_text">
        <p>
          {name}
          <span>{image}</span>
        </p>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default ContainerRow;
