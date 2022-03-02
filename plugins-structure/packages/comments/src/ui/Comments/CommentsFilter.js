import React, { useState } from "react";
import { Button, Select } from "pi-ui";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

const options = [
  {
    value: "top",
    label: "Top",
  },
  {
    value: "new",
    label: "New",
  },
  {
    value: "old",
    label: "Old",
  },
];

export const CommentsFilter = ({ onSort, onToggleFlatMode, isFlat }) => {
  const [selected, setSelected] = useState(options[0]);
  function handleFilterChanges(option) {
    setSelected(option);
    onSort(option.value);
  }
  return (
    <div className={styles.filters}>
      <div>
        Sort by:{" "}
        <Select
          options={options}
          value={selected}
          onChange={handleFilterChanges}
        />
      </div>
      <Button
        size="sm"
        kind={isFlat ? "primary" : "secondary"}
        onClick={onToggleFlatMode}
      >
        Flat Mode
      </Button>
    </div>
  );
};

CommentsFilter.propTypes = {
  onSort: PropTypes.func,
};

CommentsFilter.defaultProps = {
  onSort: () => {},
};
