import { useState } from "react";
import { IWJob } from "../../types";
import { getDuration, dateStyle } from "../../utils/time-format";
import ReactTimeAgo from "react-time-ago";

interface IProps extends IWJob {}
const JobDetails = ({ ...props }: IProps) => {
  const [option, setOption] = useState<number>(1);

  const selectedStyle = {
    borderBottom: "1px solid white ",
  };
  return (
    <div className="job_details_container">
      <div className="job_details_options">
        <div style={option === 1 ? selectedStyle : {}} className="tab" onClick={() => setOption(1)}>
          SUMMARY
        </div>
        <div style={option === 2 ? selectedStyle : {}} onClick={() => setOption(2)}>
          CONTAINER
        </div>
      </div>
      <div className="job_details_summary">
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
    </div>
  );
};

export default JobDetails;
