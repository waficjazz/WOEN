import { useState } from "react";
import { IWJob } from "../../types";

interface IProps extends IWJob {}
const JobDetails = ({ ...props }: IProps) => {
  const [option, setOption] = useState<number>(1);

  const selectedStyle = {
    borderBottom: "1px solid white ",
    transition: "border 1s ease-in-out",
  };
  return (
    <div className="job_details_container">
      <div className="job_details_options">
        <div style={option === 1 ? selectedStyle : {}} onClick={() => setOption(1)}>
          SUMMARY
        </div>
        <div style={option === 2 ? selectedStyle : {}} onClick={() => setOption(2)}>
          CONTAINER
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
