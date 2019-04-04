import React, { useState } from "react";
import ReactDataSheet from "react-datasheet";
import "react-datasheet/lib/react-datasheet.css";
import "./styles.css";
import {
  createNewRow,
  createTableHeaders,
  processTypeColChange,
  errorsMessage,
  columnTypes,
  processDomainColChange,
  updateGridCell,
  processDescriptionColChange,
  processSubdomainColChange
} from "./helpers";

const InvoiceDatasheet = () => {
  const [errors, setErrors] = useState([]);

  console.log(errors);
  const [grid, setGrid] = useState([createTableHeaders(), createNewRow(1)]);

  const handleAddNewRow = e => {
    e.preventDefault();
    const newGrid = grid.concat([createNewRow(grid.length)]);
    setGrid(newGrid);
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
          default:
            acc.grid = updateGridCell(acc.grid, change.row, change.col, {
              value: change.value
            });
            return acc;
        }
      },
      { grid, errors: new Set() }
    );

    setGrid(newGrid);
    setErrors([...newErrors]);
  };

  const anyError = !!errors.length;

  return (
    <div className="sheet-container">
      {anyError && (
        <ul className="error-list">
          {errors.map((e, idx) => (
            <li key={`error-${idx}`}>{errorsMessage[e]}</li>
          ))}
        </ul>
      )}
      <ReactDataSheet
        data={grid}
        valueRenderer={cell => cell.value}
        onContextMenu={(e, cell) => (cell.readOnly ? e.preventDefault() : null)}
        onCellsChanged={handleCellsChange}
      />
      <button onClick={handleAddNewRow}>Add new row</button>
    </div>
  );
};

export default InvoiceDatasheet;
