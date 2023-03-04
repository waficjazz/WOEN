import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { IWTemplate } from "../../types";
import "./WTemplates.css";
import { dateStyle } from "../../utils/time-format";
import ReactTimeAgo from "react-time-ago";
import * as api from "./api";
import { useAtom } from "jotai";
import { aProject } from "../../store";
interface Props extends IWTemplate {
  showSubmit: any;
}

const WTemplateRow = ({ id, name, createdAt, updatedAt, showSubmit }: Props) => {
  const [project, setProject] = useAtom(aProject);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/cw-template/${id}`);
  };

  const initWorkflow = async () => {
    try {
      let rand = Math.random().toString(36).substring(2, 6);
      showSubmit(true);
      // const response = await api.initWorkflow({ name: name + rand, templateId: id, projectId: project.id });
      // if (response.data) {
      //   navigate(`/one-workflow/${response.data.id}`);
      // }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="workflow_row" onClick={handleClick}>
        <div style={{ width: "25%" }}>{name}</div>
        <div style={{ width: "30%" }}>
          <ReactTimeAgo date={new Date(createdAt)} locale="en-US" timeStyle={dateStyle} />
        </div>
        <div style={{ width: "30%" }}>
          <ReactTimeAgo date={new Date(updatedAt)} locale="en-US" timeStyle={dateStyle} />
        </div>
        <FontAwesomeIcon
          icon={faPlus}
          onClick={(e) => {
            e.stopPropagation();
            initWorkflow();
          }}
          size="lg"
          className="template_submit_icon"
        />
      </div>
    </>
  );
};

export default WTemplateRow;
