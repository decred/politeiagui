import React from "react";
import { Tooltip, classNames } from "pi-ui";
import styles from "./CellRenderer.module.css";

const CellRenderer = props => {
  const {
    cell: { error, readOnly }
  } = props;
  return (
    <td
      className={classNames(
        props.className,
        !readOnly && error && styles.erroredCell
      )}
      onMouseDown={props.onMouseDown}
      onMouseOver={props.onMouseOver}
      onDoubleClick={props.onDoubleClick}
      onContextMenu={props.onContextMenu}
    >
      {props.children}
      {error && !readOnly && (
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
