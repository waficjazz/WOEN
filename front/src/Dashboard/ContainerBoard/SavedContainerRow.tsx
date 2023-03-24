import { socket } from "../../Socket";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faPlay, faTrashCan, faFloppyDisk, faPause } from "@fortawesome/free-solid-svg-icons";
import { ISContainer } from "../../types";
import ReactTimeAgo from "react-time-ago";
import { dateStyle } from "../../utils/time-format";
import "./styles.css";
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
      <div className="saved_container_row">
        <div>
          <FontAwesomeIcon icon={faBox} size="lg" color={setColor(status)} />
        </div>
        <div>{props.name}</div>
        <div>{props.image}</div>
        <div style={{ width: "15%" }}>
          {(props.createdAt && <ReactTimeAgo date={new Date(props.createdAt)} locale="en-US" timeStyle={dateStyle} />) || "-"}
        </div>
        <div style={{ width: "15%" }}>
          {(props.updateAt && <ReactTimeAgo date={new Date(props.updateAt)} locale="en-US" timeStyle={dateStyle} />) || "-"}
        </div>
      </div>
    </>
  );
};

export default SavedContainerRow;
