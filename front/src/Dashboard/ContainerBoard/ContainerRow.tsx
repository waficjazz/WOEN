import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faPlay, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../axios";
interface Props {
  name: string;
  image: string;
  status: string;
  id: string;
  remove: any;
}

const ContainerRow = ({ id, name, status, remove, image }: Props) => {
  const [hover, setHover] = useState(false);
  function setColor(status: string) {
    if (/^Up/.test(status)) {
      return "green";
    }
    if (status === "Created") return "red";
    return "grey";
  }

  function runContainer() {
    try {
      const response = Axios.post(`/containers/run`, { containerId: id });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="container_row" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
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
          {/* <VscDebugStart size={25} className="action_icon" onClick={runContainer} />
          <FaTrash size={20} className="action_icon" onClick={removeContainer} /> */}
          <FontAwesomeIcon icon={faPlay} size="lg" className="action_icon" onClick={runContainer} />
          <FontAwesomeIcon icon={faTrashCan} size="lg" className="action_icon" onClick={() => remove(id)} />
        </div>
      )}
    </div>
  );
};

export default ContainerRow;
