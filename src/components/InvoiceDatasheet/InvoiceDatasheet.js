import React, { useState } from "react";
import ReactDataSheet from "react-datasheet";
import dropRight from "lodash/dropRight";
import "react-datasheet/lib/react-datasheet.css";
import "./styles.css";
import {
  createNewRow,
  processTypeColChange,
  errorsMessage,
  columnTypes,
  processDomainColChange,
  updateGridCell,
  processDescriptionColChange,
  processSubdomainColChange,
  processPropTokenColChange,
  processLaborColChange,
  processExpenseColChange
} from "./helpers";

const InvoiceDatasheet = ({ input: { value, onChange } }) => {
  const grid = value;
  const [errors, setErrors] = useState([]);

  const handleAddNewRow = e => {
    e.preventDefault();
    const newGrid = grid.concat([createNewRow(grid.length)]);
    // setGrid(newGrid);
    onChange(newGrid);
  };

  const handleRemoveLastRow = e => {
    e.preventDefault();
    if (grid.length > 2) {
      //   setGrid(dropRight(grid, 1));
      onChange(dropRight(grid, 1));
    }
  };

  const handleCellsChange = changes => {
    // const newGrid = grid.map(row => [...row]);
    let result = null;
    const getGridAndErrorsFromResult = (acc, result) => ({
      grid: result.newValue,
      errors: result.error ? acc.errors.add(result.error) : acc.errors
    });

    const { grid: newGrid, errors: newErrors } = changes.reduce(
      (acc, change) => {
        switch (change.col) {
          case columnTypes.TYPE_COL:
            result = processTypeColChange(acc.grid, change);
            return getGridAndErrorsFromResult(acc, result);
          case columnTypes.DOMAIN_COL:
            result = processDomainColChange(acc.grid, change);
            return getGridAndErrorsFromResult(acc, result);
          case columnTypes.SUBDOMAIN_COL:
            result = processSubdomainColChange(acc.grid, change);
            return getGridAndErrorsFromResult(acc, result);
          case columnTypes.DESC_COL:
            result = processDescriptionColChange(acc.grid, change);
            return getGridAndErrorsFromResult(acc, result);
          case columnTypes.PROP_TOKEN_COL:
            result = processPropTokenColChange(acc.grid, change);
            return getGridAndErrorsFromResult(acc, result);
          case columnTypes.LABOR_COL:
            result = processLaborColChange(acc.grid, change);
            return getGridAndErrorsFromResult(acc, result);
          case columnTypes.EXP_COL:
            result = processExpenseColChange(acc.grid, change);
            return getGridAndErrorsFromResult(acc, result);
          default:
            acc.grid = updateGridCell(acc.grid, change.row, change.col, {
              value: change.value
            });
            return acc;
        }
      },
      { grid, errors: new Set() }
    );

    // setGrid(newGrid);
    onChange(newGrid);
    setErrors([...newErrors]);
  };

  const anyError = !!errors.length;
  const removeRowsIsDisabled = grid.length <= 2;

  return (
    <div className="sheet-container">
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

export default InvoiceDatasheet;
