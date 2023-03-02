import React from "react";

function TabsContainer(props: any) {
  const { options, selectedOption, children } = props;
  const selectedStyle = {
    borderBottom: "1px solid white ",
  };

  return (
    <div className="job_details_options">
      {options.map((option: any, index: any) => (
        <div key={index} className="tab" style={selectedOption === index ? selectedStyle : {}} onClick={() => props.setSelectedOption(index)}>
          {option.title}
        </div>
      ))}
      {children[selectedOption]}
    </div>
  );
}

export default TabsContainer;
