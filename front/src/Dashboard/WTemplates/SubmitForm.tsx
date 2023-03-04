import React from "react";

const SubmitForm = ({ close }: any) => {
  return (
    <div className="sumbit_form_container">
      <div>
        <button onClick={close}>close</button>
      </div>
    </div>
  );
};

export default SubmitForm;
