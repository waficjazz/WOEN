import { socket } from "../../Socket";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faPlay, faTrashCan, faFloppyDisk, faPause } from "@fortawesome/free-solid-svg-icons";
import { ISContainer } from "../../types";
interface Props extends ISContainer {}

const SavedContainerRow = (props: Props) => {
  function setColor(status: string) {
    if (/^Up/.test(status)) {
      return "green";
    }
    if (status === "Created") return "red";
    return "grey";
  }

  return (
    <>
      <div className="container_row">
        <FontAwesomeIcon icon={faBox} size="lg" color={setColor(status)} />
        <div className="container_row_text">
          <p>
            {props.name}
            <span>{props.image}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default SavedContainerRow;
