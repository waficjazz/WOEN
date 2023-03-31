import React, { useEffect, useState } from "react";
import Button from "../../shared/Buttons/Button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as api from "./api";
import SavedContainerRow from "./SavedContainerRow";
import { ISContainer } from "../../types";
import ContainerForm from "../LiveContainerBoard/ContainerForm";
import { useAtom } from "jotai";
import { aProject } from "../../store";

const ContainerTable = () => {
  const [project, setProject] = useAtom(aProject);
  const [containers, setContainers] = useState<ISContainer[]>();

  const [containerRef] = useAutoAnimate<HTMLDivElement>();
  const getContainers = async () => {
    try {
      const response = await api.getContainers(project.id || 0);
      if (response.data) {
        setContainers(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getContainers();
  }, []);
  return (
    <div className="container_table" ref={containerRef}>
      {containers &&
        containers.length > 0 &&
        containers.map((container) => {
          return <SavedContainerRow key={container.id} {...container} />;
        })}
    </div>
  );
};

const ContainerBoard = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="table_board">
      <div className="table_board_header">
        <p>Containers</p>
        {!showForm && <Button onClick={() => setShowForm(true)}>Create</Button>}
      </div>
      {showForm ? <ContainerForm show={showForm} close={setShowForm} save={true} /> : <ContainerTable />}
    </div>
  );
};

export default ContainerBoard;
