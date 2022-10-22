import { useEffect, useCallback, useState } from "react";
import { useAtom } from "jotai";
import { IJob } from "../../types";

const Jobs = (props: IJob) => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);

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
      {showMenu ? (
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
      )}
      <div className="created_job" about="job">
        {props.name.substring(1)}
      </div>
    </>
  );
};

export default Jobs;
