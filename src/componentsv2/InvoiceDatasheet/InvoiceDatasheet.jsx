import React, { useState, useEffect } from "react";
import { classNames } from "pi-ui";
import PropTypes from "prop-types";
import ReactDataSheet from "react-datasheet";
import dropRight from "lodash/dropRight";
import "react-datasheet/lib/react-datasheet.css";
import styles from "./InvoiceDatasheet.module.css";
import {
  processCellsChange,
  convertLineItemsToGrid,
  convertGridToLineItems,
  generateBlankLineItem,
  SUBTOTAL_COL
} from "./helpers";

const InvoiceDatasheet = ({ value, onChange, readOnly, userRate }) => {
  const [grid, setGrid] = useState([]);
  const [localUserRate, setLocalUserRate] = useState(userRate);

  const handleCellsChange = changes => {
    const { grid: newGrid } = processCellsChange(grid, changes, userRate);
    const lineItems = convertGridToLineItems(newGrid);
    onChange(lineItems);
  };

  if (localUserRate !== userRate) {
    setLocalUserRate(userRate);
    handleCellsChange([{ col: SUBTOTAL_COL }]);
  }

  const handleAddNewRow = e => {
    e.preventDefault();
    const newValue = value.concat([generateBlankLineItem()]);
    onChange(newValue);
  };

  useEffect(
    function updateGridOnValueChange() {
      const grid = convertLineItemsToGrid(value, readOnly);
      setGrid(grid);
    },
    [value, readOnly]
  );

  const handleRemoveLastRow = e => {
    e.preventDefault();
    if (grid.length > 3) {
      onChange(dropRight(value, 1));
    }
  };

  const removeRowsIsDisabled = grid && grid.length <= 3;
  return (
    <div className={styles.wrapper}>
      <ReactDataSheet
        data={grid}
        valueRenderer={cell => cell.value}
        onContextMenu={(e, cell) => (cell.readOnly ? e.preventDefault() : null)}
        onCellsChanged={handleCellsChange}
      />
      {!readOnly && (
        <div className="justify-left margin-top-s">
          <button
            className={classNames(styles.tableButton, styles.add)}
            onClick={handleAddNewRow}
          >
            Add row
          </button>
          <button
            className={classNames(
              styles.tableButton,
              styles.remove,
              removeRowsIsDisabled && styles.disabled
            )}
            onClick={handleRemoveLastRow}
          >
            Remove row
          </button>
        </div>
      )}
    </div>
  );
};

InvoiceDatasheet.propTypes = {
  value: PropTypes.array.isRequired,
  readOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func
};

InvoiceDatasheet.defaultProps = {
  readOnly: false
};

export default InvoiceDatasheet;
