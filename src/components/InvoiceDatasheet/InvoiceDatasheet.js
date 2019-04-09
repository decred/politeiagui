import React from "react";
import PropTypes from "prop-types";
import ReactDataSheet from "react-datasheet";
import dropRight from "lodash/dropRight";
import "react-datasheet/lib/react-datasheet.css";
import "./styles.css";
import { createNewRow, errorsMessage, processCellsChange } from "./helpers";

const InvoiceDatasheet = ({
  value,
  onChange,
  errors,
  onChangeErrors: setErrors,
  readOnly
}) => {
  const grid = value;

  const handleAddNewRow = e => {
    e.preventDefault();
    const newGrid = grid.concat([createNewRow(grid.length)]);
    onChange(newGrid);
  };

  const handleRemoveLastRow = e => {
    e.preventDefault();
    if (grid.length > 2) {
      onChange(dropRight(grid, 1));
    }
  };

  const handleCellsChange = changes => {
    const { grid: newGrid, errors: newErrors } = processCellsChange(
      grid,
      changes
    );
    onChange(newGrid);
    setErrors([...newErrors]);
  };

  const anyError = !!errors && !!errors.length;
  const removeRowsIsDisabled = grid && grid.length <= 2;

  return (
    <div className="sheet-container">
      {!readOnly && (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <button className="table-button add-row" onClick={handleAddNewRow}>
            Add row
          </button>
          <button
            className={`table-button remove-row ${
              removeRowsIsDisabled ? "disabled" : ""
            }`}
            onClick={handleRemoveLastRow}
          >
            Remove row
          </button>
        </div>
      )}
      <ReactDataSheet
        data={grid}
        valueRenderer={cell => cell.value}
        onContextMenu={(e, cell) => (cell.readOnly ? e.preventDefault() : null)}
        onCellsChanged={handleCellsChange}
      />
      {anyError && (
        <ul className="error-list">
          {errors.map((e, idx) => (
            <li key={`error-${idx}`}>{errorsMessage[e]}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

InvoiceDatasheet.propTypes = {
  value: PropTypes.array.isRequired,
  readOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  errors: PropTypes.array,
  onChangeErrors: PropTypes.func
};

InvoiceDatasheet.defaultProps = {
  readOnly: false
};

export default InvoiceDatasheet;
