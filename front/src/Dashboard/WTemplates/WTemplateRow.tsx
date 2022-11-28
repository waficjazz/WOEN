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

  const initWorkflow = async () => {
    try {
      let rand = Math.random().toString(36).substring(2, 6);
      const response = await Axios.post("/workflow/init", { name: name + rand, templateId: id });
      if (response.data) {
        console.log(response.data);
        navigate(`/one-workflow/${response.data.id}`);
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              initWorkflow();
            }}>
            init
          </button>
        </div>
      </div>
    </>
  );
};

export default WTemplateRow;
