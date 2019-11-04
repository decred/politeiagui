import React from "react";
import Select from "react-select";

const customStyles = {
  container: provided => ({
    ...provided,
    height: 20
  }),
  valueContainer: provided => ({
    ...provided,
    height: 20,
    fontWeight: "normal",
    display: "flex",
    alignItems: "center"
  }),
  control: provided => ({
    ...provided,
    minHeight: 20,
    height: 20
  }),
  option: provided => ({
    ...provided,
    padding: "4px 8px",
    textAlign: "left",
    fontWeight: "normal"
  }),
  dropdownIndicator: provided => ({
    ...provided,
    padding: 0
  }),
  input: provided => ({
    ...provided,
    padding: 0,
    margin: 0
  })
};

const SelectEditor = ({ value, options, onCommit }) => {
  const handleChange = ({ value }) => {
    onCommit(value);
  };
  const getValueObj = value => options.find(op => op.value === value);
  return (
    <Select
      classNamePrefix="t"
      styles={customStyles}
      autoFocus
      openOnFocus
      closeOnSelect
      options={options}
      value={getValueObj(value)}
      onChange={handleChange}
    />
  );
};

export default SelectEditor;
