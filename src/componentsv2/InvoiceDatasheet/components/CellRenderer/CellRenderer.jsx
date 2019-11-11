import React from "react";
import { Tooltip, classNames } from "pi-ui";
import styles from "./CellRenderer.module.css";

const CellRenderer = props => {
  const {
    cell: { error }
  } = props;
  return (
    <td
      className={classNames(props.className, error && styles.erroredCell)}
      onMouseDown={props.onMouseDown}
      onMouseOver={props.onMouseOver}
      onDoubleClick={props.onDoubleClick}
      onContextMenu={props.onContextMenu}
    >
      {props.children}
      {error && (
        <Tooltip
          className={styles.errorTooltip}
          contentClassName={styles.errorTooltipContent}
          placement="top"
          content={error}
        />
      )}
    </td>
  );
};

export default CellRenderer;
