import React, { useCallback } from "react";
import { Tooltip, classNames } from "pi-ui";
import styles from "./CellRenderer.module.css";
import useAsyncState from "src/hooks/utils/useAsyncState";

const CellRenderer = props => {
  const {
    cell: { error, readOnly },
    onDoubleClick,
    onMouseOver,
    onMouseDown,
    onContextMenu,
    editing
  } = props;

  const [showTooltip, setShowTooltip] = useAsyncState();

  const handleOnMouseOver = useCallback(async e => {
    if (editing) {
      await setShowTooltip(false);
    }
    onMouseOver(e);
  }, [editing, onMouseOver, setShowTooltip]);

  const handleOnMouseDown = useCallback(async e => {
    if (!editing) {
      await setShowTooltip(!!error);
      onMouseDown(e);
    }
  }, [onMouseDown, setShowTooltip, editing, error]);

  return (
    <td
      className={classNames(
        props.className,
        !readOnly && error && styles.erroredCell
      )}
      onMouseDown={handleOnMouseDown}
      onMouseOver={handleOnMouseOver}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {props.children}
      {showTooltip && (
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
