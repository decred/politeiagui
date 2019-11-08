import React, { useState, useEffect } from "react";
import { classNames, Link } from "pi-ui";
import PropTypes from "prop-types";
import ReactDataSheet from "react-datasheet";
import dropRight from "lodash/dropRight";
import "react-datasheet/lib/react-datasheet.css";
import styles from "./InvoiceDatasheet.module.css";
import { ModalEditorProvider } from "./ModalEditor";

import {
  processCellsChange,
  convertLineItemsToGrid,
  convertGridToLineItems,
  generateBlankLineItem,
  createTableHeaders,
  SUBTOTAL_COL
} from "./helpers";

const TableButton = ({ onClick, disabled, children }) => {
  return (
    <Link
      customComponent={props => (
        <span
          {...props}
          className={classNames(
            props.className,
            styles.tableButton,
            disabled && styles.tableButtonDisabled
          )}
          onClick={!disabled ? onClick : () => null}
        >
          {children}
        </span>
      )}
    />
  );
};

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
    if (grid.length > 2) {
      onChange(dropRight(value, 1));
    }
  };

  const headers = createTableHeaders();

  const removeRowsIsDisabled = grid && grid.length <= 2;
  return (
    <div className={styles.wrapper}>
      {!readOnly && (
        <div className="justify-right margin-top-s margin-bottom-s">
          <TableButton onClick={handleAddNewRow}>Add row</TableButton>
          <TableButton
            disabled={removeRowsIsDisabled}
            onClick={handleRemoveLastRow}
          >
            Remove row
          </TableButton>
        </div>
      )}

      <ModalEditorProvider>
        <div className={styles.datasheetWrapper}>
          <ReactDataSheet
            data={grid}
            valueRenderer={cell => cell.value}
            onContextMenu={(e, cell) =>
              cell.readOnly ? e.preventDefault() : null
            }
            onCellsChanged={handleCellsChange}
            sheetRenderer={props => {
              return (
                <table className={classNames(props.className, styles.table)}>
                  <thead className={styles.tableHead}>
                    {headers.map(col => (
                      <th className={styles.tableHeadCell}>{col.value}</th>
                    ))}
                  </thead>
                  <tbody>{props.children}</tbody>
                </table>
              );
            }}
            rowRenderer={props => (
              <tr className={styles.tableRow}>{props.children}</tr>
            )}
          />
        </div>
      </ModalEditorProvider>
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
