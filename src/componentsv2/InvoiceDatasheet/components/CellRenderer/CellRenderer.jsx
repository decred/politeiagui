import React from "react";
import { Tooltip } from "pi-ui";
import styles from "./CellRenderer.module.css";

const CellRenderer = ({ value, cell: { error } }) => {
  return (
    <>
      <div className={styles.value}>{value}</div>
      {error && (
        <Tooltip
          className={styles.errorTooltip}
          contentClassName={styles.errorTooltipContent}
          placement="top"
          content={error}
        />
      )}
    </>
  );
};

export default CellRenderer;
