import React from "react";
import MySelect from "../Select";

const customStyles = {
  container: provided => ({
    ...provided,
    height: "100%"
  }),
  control: provided => ({
    ...provided,
    height: "100%"
  })
};

const SelectEditor = ({ value, options, onCommit }) => {
  const handleChange = ({ value }) => {
    onCommit(value);
  };
  const getValueObj = value => options.find(op => op.value === value);
  return (
    <MySelect
      options={options}
      value={getValueObj(value)}
      onChange={handleChange}
      styles={customStyles}
    />
  );
};

export default SelectEditor;
