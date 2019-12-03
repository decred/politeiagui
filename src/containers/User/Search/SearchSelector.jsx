import React, { useState } from "react";
import { classNames } from "pi-ui";
import PropTypes from "prop-types";
import Select from "src/componentsv2/Select";
import { useReactiveSearchUser } from "./hooks";
import styles from "./SearchSelector.module.css";

const SearchSelector = ({ onChange, value, className }) => {
  const [inputValue, setInputValue] = useState("");
  const results = useReactiveSearchUser(inputValue, inputValue);
  const options = results.map(result => ({
    value: result.id,
    label: result.username
  }));
  return (
    <Select
      placeholder="Search User"
      className={classNames(styles.select, className)}
      value={value}
      onInputChange={newV => setInputValue(newV)}
      onChange={onChange}
      isMulti
      options={options}
    />
  );
};

SearchSelector.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array
};

export default SearchSelector;
