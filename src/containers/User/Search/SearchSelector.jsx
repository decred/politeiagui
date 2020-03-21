import React, { useState } from "react";
import { classNames, Select } from "pi-ui";
import PropTypes from "prop-types";
import { useReactiveSearchUser } from "./hooks";
import styles from "./SearchSelector.module.css";

const SearchSelector = ({ onChange, value, className, styles: extStyles }) => {
  const [inputValue, setInputValue] = useState("");
  const results = useReactiveSearchUser(inputValue, inputValue);
  const options = results.map((result) => ({
    value: result.id,
    label: `${result.username} | ${result.email}`
  }));
  return (
    <Select
      placeholder="Search User"
      className={classNames(styles.select, className)}
      value={value}
      onInputChange={(newV) => setInputValue(newV)}
      onChange={onChange}
      isMulti
      options={options}
      styles={extStyles}
    />
  );
};

SearchSelector.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.array,
  className: PropTypes.string,
  styles: PropTypes.object
};

export default SearchSelector;
