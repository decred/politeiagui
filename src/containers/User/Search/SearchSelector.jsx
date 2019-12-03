import React, { useState } from "react";
import Select from "src/componentsv2/Select";
import { useReactiveSearchUser } from "./hooks";
import styles from "./SearchSelector.module.css";

const SearchSelector = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const results = useReactiveSearchUser(inputValue, inputValue);
  const options = results.map(result => ({
    value: result.id,
    label: result.username
  }));
  const handleChange = newV => {
    setSelectedOptions(newV);
  };
  return (
    <Select
      placeholder="Search User"
      className={styles.select}
      value={selectedOptions}
      onInputChange={newV => setInputValue(newV)}
      onChange={handleChange}
      isMulti
      options={options}
    />
  );
};

export default SearchSelector;
