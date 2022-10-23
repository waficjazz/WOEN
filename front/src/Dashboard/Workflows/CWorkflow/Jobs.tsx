import { useEffect, useCallback, useState, useRef } from "react";
import { useAtom } from "jotai";
import { IJob } from "../../types";
import Draggable from "react-draggable";

const Jobs = (props: IJob) => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const nodeRef = useRef(null);
  const handleClick = () => {
    setShowMenu(false);
  };
  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      if (event.target?.attributes?.about) {
        if (event.target?.attributes?.about?.value === "job") {
          event.preventDefault();
          setAnchorPoint({ x: event.pageX, y: event.pageY });
          setShowMenu(true);
        } else {
          if (showMenu) setShowMenu(false);
        }
      }
    },
    [setAnchorPoint, setShowMenu]
  );

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    <>
      {/* {showMenu ? (
        <ul
          className="menu"
          style={{
            top: anchorPoint.y,
            left: anchorPoint.x,
          }}>
          <li>Share to..</li>
          <li>Cut</li>
          <li>Copy</li>
          <li>Paste</li>
          <hr className="divider" />
          <li>Refresh</li>
          <li>Exit</li>
        </ul>
      ) : (
        <> </>
      )} */}
      <Draggable grid={[120, 120]} bounds={"parent"} nodeRef={nodeRef}>
        <div ref={nodeRef} id={props.id} className="created_job" about="job">
          {props.name.substring(1)}
        </div>
      </Draggable>
    </>
  );
};

export default Jobs;
