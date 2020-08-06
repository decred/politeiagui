import React, { useState, useEffect, useCallback, useMemo } from "react";
import { classNames, H2, P } from "pi-ui";
import PropTypes from "prop-types";
import ReactDataSheet from "react-datasheet";
import dropRight from "lodash/dropRight";
import flowRight from "lodash/flowRight";
import uniq from "lodash/uniq";
import "react-datasheet/lib/react-datasheet.css";
import styles from "./InvoiceDatasheet.module.css";
import CellRenderer from "./components/CellRenderer";
import TableButton from "./components/TableButton";
import usePolicy from "src/hooks/api/usePolicy";
import useSubContractors from "src/hooks/api/useSubContractors";

import {
  processCellsChange,
  convertLineItemsToGrid,
  convertGridToLineItems,
  generateBlankLineItem,
  createTableHeaders,
  SUBTOTAL_COL
} from "./helpers";

const noop = () => {};

export const SheetRenderer = ({ headers, ...props }) => (
  <table className={classNames(props.className, styles.table)}>
    <thead>
      <tr className={styles.tableHead}>
        {headers.map((col, idx) => (
          <th
            key={`header-${idx}`}
            className={styles.tableHeadCell}
            style={{ minWidth: col.width, width: col.width }}>
            {col.value}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>{props.children}</tbody>
  </table>
);

export const TableRow = ({ children, className }) => (
  <tr className={classNames(styles.tableRow, className)}>{children}</tr>
);

const InvoiceDatasheet = React.memo(function InvoiceDatasheet({
  value,
  omit,
  onChange,
  readOnly,
  userRate,
  errors,
  proposals
}) {
  const { policy } = usePolicy();
  const { subContractors } = useSubContractors();
  const [grid, setGrid] = useState([]);
  const [currentRate, setCurrentRate] = useState(userRate || 0);

  const proposalsOptions = useMemo(
    () =>
      proposals &&
      proposals.map((p) => ({
        label: p.name,
        value: p.censorshiprecord.token
      })),
    [proposals]
  );

  const handleCellsChange = useCallback(
    (changes) => {
      const { grid: newGrid } = processCellsChange(grid, changes, userRate);
      const lineItems = convertGridToLineItems(newGrid);
      onChange && onChange(lineItems);
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
    (e) => {
      e && e.preventDefault();
      const newValue = value.concat([generateBlankLineItem(policy)]);
      onChange(newValue);
    },
    [onChange, value, policy]
  );

  useEffect(
    function updateGridOnValueChange() {
      const grid = convertLineItemsToGrid(
        value,
        readOnly,
        errors,
        currentRate,
        policy,
        proposalsOptions,
        subContractors
      );
      setGrid(grid);
    },
    [
      value,
      readOnly,
      errors,
      currentRate,
      policy,
      proposalsOptions,
      subContractors
    ]
  );

  const handleCopy = (e) => {
    const selection = document.getSelection();
    if (window.clipboardData && window.clipboardData.setData) {
      window.clipboardData.setData("Text", selection.toString());
    } else {
      e.clipboardData.setData("text/plain", selection.toString());
    }
    e.preventDefault();
    /**
     *  The next line is necessary to not run the callback for the event
     * listener attached to the document by react-spreadsheet
     */
    e.stopPropagation();
  };

  /**
   * This hook adds a listener to a copy action in the document.body.
   * Adding it to the document.body allow us to overwrite the one added by react-spreadsheet to the document.
   */
  useEffect(
    function customCopy() {
      if (readOnly) {
        document.body.addEventListener("copy", handleCopy);

        return function removeCopyListener() {
          document.body.removeEventListener("copy", handleCopy);
        };
      }
    },
    [readOnly]
  );
  const handlePaste = (str) => {
    // Track number of lines pasted
    let rowCount = 0;

    // Parse pasted comma-separated values
    const grid = str.split(/\r\n|\n|\r/).map(function (row) {
      rowCount++;
      return row.split("\t");
    });

    // Add new rows programtically in case the user wants to paste more lines than the number currently available
    let newValue = value;
    for (let i = value.length; i < rowCount; i++) {
      newValue = newValue.concat([generateBlankLineItem(policy)]);
    }
    // Update state
    onChange(newValue);

    return grid;
  };

  const handleRemoveLastRow = useCallback(
    (e) => {
      e.preventDefault();
      if (grid.length > 2) {
        onChange(dropRight(value, 1));
      }
    },
    [onChange, value, grid.length]
  );

  const headers = useMemo(() => createTableHeaders(omit), [omit]);

  const onContextMenu = useCallback(
    (e, cell) => (cell.readOnly ? e.preventDefault() : null),
    []
  );

  const valueRenderer = useCallback((cell) => cell.value, []);

  const sheetRenderer = useCallback(
    (props) => <SheetRenderer {...props} headers={headers} />,
    [headers]
  );

  const rowRenderer = useCallback(
    (props) => <TableRow>{props.children}</TableRow>,
    []
  );

  const removeRowsIsDisabled = grid && grid.length <= 2;

  const renderErrors = () => {
    // Get all unique normalized errors
    const uniqueErrArr = flowRight([
      uniq,
      () => errors && errors.flatMap((error) => Object.values(error))
    ])();
    return uniqueErrArr && uniqueErrArr.length ? (
      <div>
        <H2 className={styles.invoiceError}>Errors</H2>
        {uniqueErrArr.map((err, i) => (
          <P key={i} className={styles.invoiceError}>
            {err.charAt(0).toUpperCase() + err.slice(1)}
          </P>
        ))}
      </div>
    ) : null;
  };
  return (
    <div className={styles.wrapper}>
      {renderErrors()}
      {!readOnly && (
        <div className="justify-right margin-top-s margin-bottom-s">
          <TableButton onClick={handleAddNewRow}>Add item</TableButton>
          <TableButton
            disabled={removeRowsIsDisabled}
            onClick={handleRemoveLastRow}>
            Remove item
          </TableButton>
        </div>
      )}
      <div className={styles.datasheetWrapper}>
        <ReactDataSheet
          data={grid}
          parsePaste={handlePaste}
          valueRenderer={valueRenderer}
          onContextMenu={onContextMenu}
          onCellsChanged={!readOnly ? handleCellsChange : noop}
          sheetRenderer={sheetRenderer}
          rowRenderer={rowRenderer}
          cellRenderer={CellRenderer}
        />
      </div>
    </div>
  );
});

InvoiceDatasheet.propTypes = {
  value: PropTypes.array.isRequired,
  omit: PropTypes.array,
  readOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  proposals: PropTypes.array.isRequired
};

InvoiceDatasheet.defaultProps = {
  readOnly: false
};

export default InvoiceDatasheet;
