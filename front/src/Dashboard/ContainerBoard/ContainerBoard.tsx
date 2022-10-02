import React, { useEffect, useState } from "react";
import Axios from "../../axios";
import "./ContainerBoard.css";
import ContainerRow from "./ContainerRow";
import ContainerForm from "./ContainerForm";
import Button from "../../shared/Buttons/Button";

const ContainerTable = () => {
  interface Container {
    Id: string;
    Image: string;
    Status: string;
    Names: string[];
  }
  const [containers, setContainers] = useState<Container[]>();
  const getContainers = async () => {
    try {
      const response = await Axios.get("/containers/list");
      if (response.data) {
        setContainers(response.data.containers);
      }
    } catch (err) {
      console.log(err);
    }
  };
  async function removeContainer(id: string) {
    try {
      const response = await Axios.delete(`/containers/remove`, { data: { containerId: id } });
      setContainers((prev) => prev?.filter((c) => c.Id !== id));
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    console.log("rendered");
    getContainers();
    const interval = setInterval(() => {
      getContainers();
      console.log("arefresh");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container_table">
      {containers &&
        containers.length > 0 &&
        containers.map((container) => {
          return (
            <ContainerRow
              remove={removeContainer}
              key={container.Id}
              id={container.Id}
              image={container.Image}
              name={container.Names[0].slice(1)}
              status={container.Status}
            />
          );
        })}
    </div>
  );
};

const ContainerBoard = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container_board">
      <div className="container_board_header">
        <p>Containers</p>
        {!showForm && <Button onClick={() => setShowForm(true)}>Create</Button>}
      </div>
      {showForm ? <ContainerForm /> : <ContainerTable />}
    </div>
  );
};

export default ContainerBoard;
