import { useEffect, useState } from "react";
import { IWJob } from "../../types";
import { getDuration, dateStyle } from "../../utils/time-format";
import ReactTimeAgo from "react-time-ago";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface IProps extends IWJob {}
const JobDetails = ({ ...props }: IProps) => {
  const [jdRef] = useAutoAnimate<HTMLDivElement>();

  const [option, setOption] = useState<number>(1);

  const selectedStyle = {
    borderBottom: "1px solid white ",
  };
  return (
    <div className="job_details_container" ref={jdRef}>
      <div className="job_details_options">
        <div style={option === 1 ? selectedStyle : {}} className="tab" onClick={() => setOption(1)}>
          SUMMARY
        </div>
        <div style={option === 2 ? selectedStyle : {}} onClick={() => setOption(2)}>
          CONTAINER
        </div>
      </div>
      {option === 1 && (
        <div className="job_details">
          <div>
            <label>NAME</label>
            <p>{props.name}</p>
          </div>
          <div>
            <label>STATUS</label>
            <p>{props.status}</p>
          </div>
          <div>
            <label>START TIME</label>
            <p>{(props.startedAt && <ReactTimeAgo date={new Date(props.startedAt)} locale="en-US" timeStyle={dateStyle} />) || "-"}</p>
          </div>
          <div>
            <label>END TIME</label>
            <p>{(props.finishedAt && <ReactTimeAgo date={new Date(props.finishedAt)} locale="en-US" timeStyle={dateStyle} />) || "-"}</p>
          </div>
          <div>
            <label>DURATION</label>
            <p>
              {(props.finishedAt && props.startedAt && getDuration(new Date(props.startedAt), new Date(props.finishedAt))) ||
                (props.startedAt && <ReactTimeAgo date={new Date(props.startedAt)} locale="en-US" timeStyle="mini" />) ||
                "-"}
            </p>
          </div>
        </div>
      )}
      {option === 2 && (
        <div className="job_details">
          <div>
            <label>NAME</label>
            <p>{props.container?.name || "-"}</p>
          </div>
          <div>
            <label>IMAGE</label>
            <p>{props.container?.image || "-"}</p>
          </div>
          <div>
            <label>CREATED</label>
            <p>
              {(props.container?.createdAt && <ReactTimeAgo date={new Date(props.container?.createdAt)} locale="en-US" timeStyle={dateStyle} />) ||
                "-"}
            </p>
          </div>
          <div>
            <>
              <label>COMMANDS</label>
              <div className="container_commands">
                {props.container?.commands &&
                  props.container?.commands[2].split(";").map((l) => {
                    return <div>{l}</div>;
                  })}
              </div>
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
