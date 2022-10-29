import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faPlay, faTrashCan, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../axios";
import "./Workflows.css";
interface Props {
  id: string;
  name: string;
}

const WorkflowRow = ({ id, name }: Props) => {
  const [logs, setLogs] = useState("");
  const [hover, setHover] = useState(false);

  return (
    <>
      <div className="workflow_row">{name}</div>
    </>
  );
};

export default WorkflowRow;
