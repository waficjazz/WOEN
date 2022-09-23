import React from "react";
import "./ContainerBoard.css";
import Button from "../../shared/Button";
import ContainerRow from "./ContainerRow";
const ContainerBoard = () => {
  return (
    <div className="container_board">
      <div className="container_board_header">
        <p>Containers</p>
        <Button>Create</Button>
      </div>
      <div className="container_table">
        <ContainerRow />
      </div>
    </div>
  );
};

export default ContainerBoard;
