import React, { useEffect, useState } from "react";
import "./ContainerBoard.css";
import ContainerRow from "./ContainerRow";
import ContainerForm from "./ContainerForm";
import Button from "../../shared/Buttons/Button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as api from "./api";
const ContainerTable = () => {
  interface Container {
    Id: string;
    Image: string;
    Status: string;
    Names: string[];
  }
  const [containers, setContainers] = useState<Container[]>();

  const [containerRef] = useAutoAnimate<HTMLDivElement>();
  const getContainers = async () => {
    try {
      const response = await api.getContainers();
      if (response.data) {
        setContainers(response.data.containers);
      }
    } catch (err) {
      console.log(err);
    }
  };
  async function removeContainer(id: string) {
    try {
      const response = await api.removeContainer({ containerId: id });
      setContainers((prev) => prev?.filter((c) => c.Id !== id));
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getContainers();
    const interval = setInterval(() => {
      getContainers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container_table" ref={containerRef}>
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

const LiveContainerBoard = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="table_board">
      <div className="table_board_header">
        <p>Containers</p>
        {!showForm && <Button onClick={() => setShowForm(true)}>Create</Button>}
      </div>
      {showForm ? <ContainerForm show={showForm} close={setShowForm} create={true} /> : <ContainerTable />}
    </div>
  );
};

export default LiveContainerBoard;
