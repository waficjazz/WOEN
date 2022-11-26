import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faPlay, faTrashCan, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import Axios from "../../axios";
import "./WTemplates.css";
interface Props {
  id: string;
  name: string;
  placements: any;
}

const WTemplateRow = ({ id, name, placements }: Props) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/cw-template/${id}`);
  };
  const [logs, setLogs] = useState("");
  const [hover, setHover] = useState(false);

  const initWorkflow = async () => {
    try {
      const response = await Axios.post("/workflow/init", { name: name + "aa", templateId: id });
      if (response.data) {
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="workflow_row" onClick={handleClick}>
        <div>
          <p>{name}</p>
          <button onClick={initWorkflow}>init</button>
        </div>
      </div>
    </>
  );
};

export default WTemplateRow;
