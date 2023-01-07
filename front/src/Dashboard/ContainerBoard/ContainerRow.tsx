import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faPlay, faTrashCan, faFloppyDisk, faPause } from "@fortawesome/free-solid-svg-icons";
import CTextArea from "../../shared/TextAreas/CTextArea";
import * as api from "./api";
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

  const pausecontainer = async () => {
    try {
      const response = await api.containerPause({ containerId: id });
    } catch (err) {
      console.log(err);
    }
  };

  const unpausecontainer = async () => {
    try {
      const response = await api.containerUnpause({ containerId: id });
    } catch (err) {
      console.log(err);
    }
  };

  async function runContainer() {
    try {
      const response = await api.containerRun({ containerId: id });
    } catch (err) {
      console.log(err);
    }
  }

  async function saveContainer() {
    try {
      const response = await api.containerSave({ containerId: id });
    } catch (err) {
      console.log(err);
    }
  }

  async function getLogs() {
    try {
      const response = await api.conatainerLogs({ containerId: id });
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
            <FontAwesomeIcon icon={faFloppyDisk} size="lg" className="action_icon" onClick={saveContainer} />
            {/^Up/.test(status) && !/Paused/.test(status) && (
              <FontAwesomeIcon icon={faPause} size="lg" className="action_icon" onClick={pausecontainer} />
            )}
            {/Paused/.test(status) && <FontAwesomeIcon icon={faPlay} size="lg" className="action_icon" onClick={unpausecontainer} />}
            {!/^Up/.test(status) && <FontAwesomeIcon icon={faPlay} size="lg" className="action_icon" onClick={runContainer} />}
            <FontAwesomeIcon icon={faTrashCan} size="lg" className="action_icon" onClick={() => remove(id)} />
          </div>
        )}
      </div>
      {/* {logs.length > 1 && <CTextArea value={logs} />} */}
    </>
  );
};

export default ContainerRow;
