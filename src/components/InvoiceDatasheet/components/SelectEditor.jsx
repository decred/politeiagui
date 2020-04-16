import React, { useCallback } from "react";
import { Select } from "pi-ui";
import useAsyncState from "src/hooks/utils/useAsyncState";

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

const SelectEditor = ({ value, options, onChange, onCommit }) => {
  const getValueObj = useCallback((value) => (
    options.find(op => op.value === value)
  ), [options]);

  const [newValue, setNewValue] = useAsyncState(getValueObj(value));

  const handleChange = useCallback(async ({ value }) => {
    await setNewValue(getValueObj(value));
    onChange(value);
    onCommit(value);
  }, [setNewValue, getValueObj, onChange, onCommit]);

  return (
    <Select
      options={options}
      value={newValue}
      onChange={handleChange}
      styles={customStyles}
    />
  );
};

export default SelectEditor;
