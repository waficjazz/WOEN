import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { IWorkflowParam, IWTemplate } from "../../types";
import "./WTemplates.css";
import { dateStyle } from "../../utils/time-format";
import ReactTimeAgo from "react-time-ago";
import * as api from "./api";
import { useAtom } from "jotai";
import { aProject } from "../../store";
import SubmitForm from "./SubmitForm";
interface Props extends IWTemplate {
  remove: () => void;
  checked: boolean;
  select: () => void;
}

const WTemplateRow = ({ id, name, createdAt, updatedAt, parameters, select, checked }: Props) => {
  const [showSubmit, setShowSubmit] = useState(false);
  const [project, setProject] = useAtom(aProject);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/cw-template/${id}`);
  };

  const initWorkflow = async (params: IWorkflowParam) => {
    try {
      let rand = Math.random().toString(36).substring(2, 6);
      setShowSubmit(false);
      const response = await api.initWorkflow({ name: name + rand, templateName: name, projectId: project.id, params });
      if (response.data) {
        navigate(`/one-workflow/${response.data.id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="workflow_row" onClick={handleClick}>
        {showSubmit && <SubmitForm close={() => setShowSubmit(false)} init={initWorkflow} params={parameters!!} />}
        <div style={{ width: "3%" }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              select();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
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
            setShowSubmit(true);
          }}
          size="lg"
          className="template_submit_icon"
        />
      </div>
    </>
  );
};

export default WTemplateRow;
