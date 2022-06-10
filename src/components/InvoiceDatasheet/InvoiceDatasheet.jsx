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
            style={{ minWidth: col.width, width: col.width }}
          >
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
  onChange,
  readOnly,
  userRate,
  errors,
  proposals,
  proposalsError,
  isMobile
}) {
  const { policy } = usePolicy();
  const { subContractors, error: subContractorsError } = useSubContractors();
  const [grid, setGrid] = useState([]);
  const [currentRate, setCurrentRate] = useState(userRate || 0);

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
        proposals,
        subContractors,
        proposalsError,
        subContractorsError
      );
      setGrid(grid);
    },
    [
      value,
      readOnly,
      errors,
      currentRate,
      policy,
      subContractors,
      proposalsError,
      subContractorsError,
      proposals
    ]
  );

  const copyTextToClipboard = (e, text) => {
    if (window.clipboardData && window.clipboardData.setData) {
      window.clipboardData.setData("Text", text);
    } else {
      e.clipboardData.setData("text/plain", text);
    }
  };

  const handleCopy = ({
    range,
    start,
    end,
    event,
    data,
    dataRenderer,
    valueRenderer
  }) => {
    const selection = document.getSelection();
    const text = selection.toString();
    if (start.i === end.i && start.j === end.j && text) {
      copyTextToClipboard(event, text);
    } else {
      const text = range(start.i, end.i)
        .map((i) =>
          range(start.j, end.j)
            .map((j) => {
              const cell = data[i][j];
              const value = dataRenderer ? dataRenderer(cell, i, j) : null;
              if (
                value === "" ||
                value === null ||
                typeof value === "undefined"
              ) {
                return valueRenderer(cell, i, j);
              }
              return value;
            })
            .join("\t")
        )
        .join("\n");
      copyTextToClipboard(event, text);
    }
  };

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

  const headers = useMemo(() => createTableHeaders(isMobile), [isMobile]);

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
      {proposalsError && (
        <div className="margin-bottom-s margin-top-s">
          <H2 className={styles.invoiceError}>{proposalsError.toString()}</H2>
          <P className={styles.invoiceError}>Unable to fetch proposals</P>
        </div>
      )}
      {renderErrors()}
      {!readOnly && (
        <div className="justify-right margin-top-s margin-bottom-s">
          <TableButton onClick={handleAddNewRow}>Add item</TableButton>
          <TableButton
            disabled={removeRowsIsDisabled}
            onClick={handleRemoveLastRow}
          >
            Remove item
          </TableButton>
        </div>
      )}
      <div className={styles.datasheetWrapper}>
        <ReactDataSheet
          data={grid}
          handleCopy={handleCopy}
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
  readOnly: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  proposals: PropTypes.array.isRequired,
  isMobile: PropTypes.bool
};

InvoiceDatasheet.defaultProps = {
  readOnly: false
};

export default InvoiceDatasheet;
