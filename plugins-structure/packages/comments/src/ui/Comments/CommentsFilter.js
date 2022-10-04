import React, { useState } from "react";
import { Select, Text, classNames } from "pi-ui";
import PropTypes from "prop-types";
import styles from "./styles.module.css";
import { sortByNewest, sortByOldest, sortByScore } from "./utils";

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

export const CommentsFilter = ({
  onSort,
  onToggleFlatMode,
  isFlat,
  hideFlatModeButton,
}) => {
  const [selected, setSelected] = useState(options[0]);

  function handleFilterChanges(option) {
    setSelected(option);
    let sortFn;
    switch (option.value) {
      case "new":
        sortFn = sortByNewest;
        break;
      case "old":
        sortFn = sortByOldest;
        break;
      default:
        sortFn = sortByScore;
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
        customStyles={{ container: () => ({ padding: "0" }) }}
      />
      {!hideFlatModeButton && (
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
      )}
    </div>
  );
};

CommentsFilter.propTypes = {
  onSort: PropTypes.func,
};

CommentsFilter.defaultProps = {
  onSort: () => {},
};
