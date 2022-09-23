import React from "react";
import { BsBoxSeam } from "react-icons/bs";

interface Props {
  name: string;
  image: string;
  status: string;
}

const ContainerRow = ({ name, status, image }: Props) => {
  return (
    <div className="container_row">
      <BsBoxSeam size={20} color={"green"} />
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
