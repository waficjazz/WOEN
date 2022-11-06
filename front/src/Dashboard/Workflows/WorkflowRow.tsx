import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faPlay, faTrashCan, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import "./Workflows.css";
interface Props {
  id: string;
  name: string;
  placements: any;
}

const WorkflowRow = ({ id, name, placements }: Props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/cworkflow/${id}`);
  };
  const [logs, setLogs] = useState("");
  const [hover, setHover] = useState(false);

  return (
    <>
      <div className="workflow_row" onClick={handleClick}>
        <div>
          <p>{name}</p>
        </div>
      </div>
    </>
  );
};

export default WorkflowRow;
