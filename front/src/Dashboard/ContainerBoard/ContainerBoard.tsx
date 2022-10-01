import React, { useEffect, useState } from "react";
import Axios from "../../axios";
import "./ContainerBoard.css";
import ContainerRow from "./ContainerRow";
import ContainerForm from "./ContainerForm";
import Button from "../../shared/Buttons/Button";
const ContainerBoard = () => {
  interface Container {
    Id: string;
    Image: string;
    Status: string;
    Names: string[];
  }
  let a = [
    { Id: "1", Image: "1", Status: "1" },
    { Id: "2", Image: "2", Status: "2" },
  ];
  const [containers, setContainers] = useState<Container[]>();

  const [showForm, setShowForm] = useState(false);

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

  useEffect(() => {
    getContainers();
    refresh();
  }, []);

  function refresh() {
    setInterval(() => {
      getContainers();
    }, 5000);
  }
  return (
    <div className="container_board">
      <div className="container_board_header">
        <p>Containers</p>
        <Button onClick={() => setShowForm(true)}>Create</Button>
      </div>
      {showForm ? (
        <ContainerForm />
      ) : (
        <div className="container_table">
          {containers &&
            containers.length > 0 &&
            containers.map((container) => {
              return (
                <ContainerRow
                  key={container.Id}
                  id={container.Id}
                  image={container.Image}
                  name={container.Names[0].slice(1)}
                  status={container.Status}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ContainerBoard;
