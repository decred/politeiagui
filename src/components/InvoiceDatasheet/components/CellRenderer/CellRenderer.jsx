import React, { useCallback } from "react";
import { classNames } from "pi-ui";
import styles from "./CellRenderer.module.css";

const CellRenderer = ({
  cell: { error, readOnly },
  onDoubleClick,
  onMouseOver,
  onMouseDown,
  onContextMenu,
  editing,
  className,
  children
}) => {
  const handleOnMouseOver = useCallback(
    (e) => {
      onMouseOver(e);
    },
    [onMouseOver]
  );

  const handleOnMouseDown = useCallback(
    (e) => {
      if (!editing) {
        onMouseDown(e);
      }
    },
    [onMouseDown, editing]
  );

  return (
    <td
      className={classNames(
        className,
        !readOnly && error && styles.erroredCell
      )}
      onMouseDown={handleOnMouseDown}
      onMouseOver={handleOnMouseOver}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {children}
    </td>
  );
};

export default CellRenderer;
