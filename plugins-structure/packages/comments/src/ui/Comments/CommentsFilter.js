import React, { useState } from "react";
import { Select, Text, classNames } from "pi-ui";
import PropTypes from "prop-types";
import styles from "./styles.module.css";
import { sortByNew, sortByOld, sortByTop } from "./utils";

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
    let sortFn;
    switch (option.value) {
      case "new":
        sortFn = sortByNew;
        break;
      case "old":
        sortFn = sortByOld;
        break;
      default:
        sortFn = sortByTop;
        break;
    }
    onSort(sortFn);
  }

  return (
    <div className={styles.filters}>
      <Select
        options={options}
        value={selected}
        onChange={handleFilterChanges}
      />
      <div
        className={classNames(
          styles.flatButtonWrapper,
          isFlat && styles.flatModeActive
        )}
        onClick={onToggleFlatMode}
      >
        <Text
          className={classNames(
            styles.flatButtonText,
            isFlat && styles.flatModeActive
          )}
        >
          Flat mode
        </Text>
      </div>
    </div>
  );
};

CommentsFilter.propTypes = {
  onSort: PropTypes.func,
};

CommentsFilter.defaultProps = {
  onSort: () => {},
};
