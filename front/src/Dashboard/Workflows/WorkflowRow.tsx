import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faPlay, faTrashCan, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Workflows.css";
import "../ContainerBoard/ContainerBoard.css";
import { Manager } from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5001";

interface Props {
  id: string;
  name: string;
  placements: any;
  remove: any;
}

const WorkflowRow = ({ id, name, remove }: Props) => {
  const manager = new Manager("http://127.0.0.1:5001");

  const socket = manager.socket("/");
  useEffect(() => {
    socket.on("test", (data) => {
      console.log(data);
    });
  }, []);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/one-workflow/${id}`);
  };
  const [logs, setLogs] = useState("");
  const [hover, setHover] = useState(false);

  return (
    <>
      <div className="workflow_row" onClick={handleClick}>
        <p>{name}</p>
        <FontAwesomeIcon icon={faTrashCan} className="action_icon" size="lg" onClick={(e) => remove(e, id)} />
      </div>
    </>
  );
};

export default WorkflowRow;
