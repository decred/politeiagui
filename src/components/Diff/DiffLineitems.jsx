import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { classNames, useTheme } from "pi-ui";
import { fromUSDCentsToUSDUnits, fromMinutesToHours } from "src/helpers";
import styles from "./Diff.module.css";
import { TableRow } from "src/components/InvoiceDatasheet/InvoiceDatasheet";
import { getTotalsLine } from "src/components/InvoiceDatasheet/helpers";

const renderGrid = (lineItems) =>
  lineItems.reduce(
    (acc, line) => {
      const {
        type,
        index,
        domain,
        subdomain,
        description,
        proposaltoken,
        subuserid,
        subrate,
        labor,
        expenses,
        rate,
        ...others
      } = line;

      const laborHours = +fromMinutesToHours(labor);
      const subRate = +fromUSDCentsToUSDUnits(subrate);
      const lineExpenses = +fromUSDCentsToUSDUnits(expenses);

      const subTotal =
        type !== 4 ? laborHours * rate + expenses : laborHours * subRate;
      const lineSubTotal = +fromUSDCentsToUSDUnits(subTotal);
      const newLine = [
        { value: index + 1 },
        { value: type },
        { value: domain },
        { value: subdomain },
        {
          value: description,
          multiline: true
        },
        { value: proposaltoken },
        { value: subuserid },
        { value: subRate },
        { value: laborHours },
        { value: lineExpenses },
        { value: lineSubTotal }
      ];
      return {
        grid: acc.grid.concat({ items: newLine, ...others }),
        expenseTotal: acc.expenseTotal + (line.removed ? 0 : line.expenses),
        laborTotal: acc.laborTotal + (line.removed ? 0 : line.labor),
        total: acc.total + (line.removed ? 0 : lineSubTotal)
      };
    },
    { grid: [], expenseTotal: 0, laborTotal: 0, total: 0 }
  );

const DiffLineitems = ({ lineItems }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

  const { grid, expenseTotal, laborTotal, total } = useMemo(
    () => renderGrid(lineItems),
    [lineItems]
  );

  const numberOfCols = grid.length && grid[0] && grid[0].items.length;

  const newTotals = [
    { value: "Total" },
    { value: +fromMinutesToHours(laborTotal) },
    { value: expenseTotal },
    { value: total }
  ];
  const lastLine = getTotalsLine(numberOfCols, newTotals);

  const dataSheet = grid.concat({ items: lastLine });

  return (
    <>
      {dataSheet.map((line, index) => (
        <TableRow
          key={index}
          className={classNames(
            line.added && isDarkTheme && styles.lineitemsAddedDark,
            line.added && !isDarkTheme && styles.lineitemsAdded,
            line.removed && isDarkTheme && styles.lineitemsRemovedDark,
            line.removed && !isDarkTheme && styles.lineitemsRemoved
          )}>
          {line.items.map((item, idx) => (
            <td
              key={idx}
              className={classNames(
                "cell",
                item.multiline && styles.multiline
              )}>
              {item.value}
            </td>
          ))}
        </TableRow>
      ))}
    </>
  );
};

DiffLineitems.propTypes = {
  lineItems: PropTypes.array.isRequired
};

export default DiffLineitems;
