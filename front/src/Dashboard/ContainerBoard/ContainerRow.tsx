import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faPlay, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../axios";
import CTextArea from "../../shared/TextAreas/CTextArea";
interface Props {
  name: string;
  image: string;
  status: string;
  id: string;
  remove: any;
}

const ContainerRow = ({ id, name, status, remove, image }: Props) => {
  const [logs, setLogs] = useState("");
  const [hover, setHover] = useState(false);
  function setColor(status: string) {
    if (/^Up/.test(status)) {
      return "green";
    }
    if (status === "Created") return "red";
    return "grey";
  }

  async function runContainer() {
    try {
      const response = await Axios.post(`/containers/run`, { containerId: id });
    } catch (err) {
      console.log(err);
    }
  }

  async function getLogs() {
    try {
      const response = await Axios.post(`/containers/logs`, { containerId: id });
      setLogs(response.data.logs);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div className="container_row" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={getLogs}>
        <FontAwesomeIcon icon={faBox} size="lg" color={setColor(status)} />
        <div className="container_row_text">
          <p>
            {name}
            <span>{image}</span>
          </p>
          <p>{status}</p>
        </div>
        {hover && (
          <div className="container_actions">
            <FontAwesomeIcon icon={faPlay} size="lg" className="action_icon" onClick={runContainer} />
            <FontAwesomeIcon icon={faTrashCan} size="lg" className="action_icon" onClick={() => remove(id)} />
          </div>
        )}
      </div>
      {/* {logs.length > 1 && <CTextArea value={logs} />} */}
    </>
  );
};

export default ContainerRow;
