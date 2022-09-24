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
  }
  const [containers, setContainers] = useState<Container[]>([]);

  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    const getContainers = async () => {
      try {
        const response = await Axios.get("/containers/list");
        if (response.data) {
          console.log(response.data);
          setContainers((prev) => [...prev, response.data]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getContainers();
  }, []);

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
          {/* {containers &&
            containers.length > 0 &&
            containers.map((ctn) => {
              console.log(ctn);
              return <ContainerRow key={ctn.Id} image={ctn.Image} name={"hello"} status={ctn.Status} />;
            })} */}
        </div>
      )}
    </div>
  );
};

export default ContainerBoard;
