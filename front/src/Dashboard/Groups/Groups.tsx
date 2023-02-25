import { useEffect, useState } from "react";
import Button from "../../shared/Buttons/Button";
import { IGroup } from "../../types";
import CreateGroup from "./CreateGroup";
import * as api from "./api";
import GroupRow from "./GroupRow";

const Groups = () => {
  const [showForm, setShowForm] = useState(false);

  const GroupsTable = () => {
    const [groups, setGroups] = useState<IGroup[]>([]);

    useEffect(() => {
      const getProjects = async () => {
        try {
          const response = await api.getGroups();
          if (response.data) {
            setGroups(response.data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      getProjects();
    }, []);
    return (
      <div className="workflow_table">
        <div className="workflow_table_header ">
          <div style={{ width: "25%" }}>NAME</div>
          <div style={{ width: "30%" }}>CREATED</div>
          <div style={{ width: "30%" }}>LAST UPDATE</div>
        </div>
        {groups &&
          groups.length > 0 &&
          groups.map((grp) => {
            return <GroupRow key={grp.id} {...grp} />;
          })}
      </div>
    );
  };

  return (
    <>
      <div className="table_board">
        <div className="table_board_header">
          <p>Groups</p>
          {!showForm && <Button onClick={() => setShowForm(true)}>Create</Button>}
        </div>
        {showForm ? <CreateGroup show={showForm} close={setShowForm} /> : <GroupsTable />}
      </div>
    </>
  );
};

export default Groups;
