import { useEffect, useCallback, useState } from "react";
import { useAtom } from "jotai";
import { IJob } from "../../types";

const Jobs = (props: IJob) => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setShowMenu(true);
    },
    [setAnchorPoint, setShowMenu]
  );

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return <div className="created_job">{props.name.substring(1)}</div>;
};

export default Jobs;
