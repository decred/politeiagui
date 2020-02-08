import React, { useState, useEffect, useCallback, useMemo } from "react";
import { classNames } from "pi-ui";
import PropTypes from "prop-types";
import ReactDataSheet from "react-datasheet";
import dropRight from "lodash/dropRight";
import "react-datasheet/lib/react-datasheet.css";
import styles from "./InvoiceDatasheet.module.css";
import { ModalEditorProvider } from "./components/ModalEditor";
import CellRenderer from "./components/CellRenderer";
import TableButton from "./components/TableButton";

import {
  processCellsChange,
  convertLineItemsToGrid,
  convertGridToLineItems,
  generateBlankLineItem,
  createTableHeaders,
  SUBTOTAL_COL
} from "./helpers";

const InvoiceDatasheet = React.memo(function InvoiceDatasheet({
  value,
  onChange,
  readOnly,
  userRate,
  errors,
  proposalsTokens
}) {
  const [grid, setGrid] = useState([]);
  const [currentRate, setCurrentRate] = useState(userRate || 0);

  const handleCellsChange = useCallback(
    changes => {
      const { grid: newGrid } = processCellsChange(grid, changes, userRate);
      const lineItems = convertGridToLineItems(newGrid);
      onChange(lineItems);
    },
    [userRate, onChange, grid]
  );

  useEffect(
    function updateSubTotalOnUserRateChange() {
      if (!!userRate && userRate !== currentRate) {
        setCurrentRate(userRate);
        handleCellsChange([{ col: SUBTOTAL_COL }]);
      }
    },
    [userRate, handleCellsChange, currentRate, setCurrentRate]
  );

  const handleAddNewRow = useCallback(
    e => {
      e.preventDefault();
      const newValue = value.concat([generateBlankLineItem()]);
      onChange(newValue);
    },
    [onChange, value]
  );

  useEffect(
    function updateGridOnValueChange() {
      const grid = convertLineItemsToGrid(value, readOnly, errors, currentRate, proposalsTokens);
      setGrid(grid);
    },
    [value, readOnly, errors, currentRate, proposalsTokens]
  );

  const handleRemoveLastRow = useCallback(
    e => {
      e.preventDefault();
      if (grid.length > 2) {
        onChange(dropRight(value, 1));
      }
    },
    [onChange, value, grid.length]
  );

  const headers = useMemo(() => createTableHeaders(), []);

  const onContextMenu = useCallback(
    (e, cell) => (cell.readOnly ? e.preventDefault() : null),
    []
  );

  const valueRenderer = useCallback(cell => cell.value, []);

  const sheetRenderer = useCallback(
    props => {
      return (
        <table className={classNames(props.className, styles.table)}>
          <thead>
            <tr className={styles.tableHead}>
              {headers.map((col, idx) => (
                <th key={`header-${idx}`} className={styles.tableHeadCell}>
                  {col.value}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{props.children}</tbody>
        </table>
      );
    },
    [headers]
  );

  const rowRenderer = useCallback(
    props => <tr className={styles.tableRow}>{props.children}</tr>,
    []
  );

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
            valueRenderer={valueRenderer}
            onContextMenu={onContextMenu}
            onCellsChanged={handleCellsChange}
            sheetRenderer={sheetRenderer}
            rowRenderer={rowRenderer}
            cellRenderer={CellRenderer}
          />
        </div>
      </ModalEditorProvider>
    </div>
  );
});

InvoiceDatasheet.propTypes = {
  value: PropTypes.array.isRequired,
  readOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func
};

InvoiceDatasheet.defaultProps = {
  readOnly: false
};

export default InvoiceDatasheet;
