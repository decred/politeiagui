import React from "react";
import {
  fromHoursToMinutes,
  fromUSDCentsToUSDUnits,
  fromMinutesToHours,
  fromUSDUnitsToUSDCents
} from "../../helpers";
import SelectEditor from "./SelectEditor";
import MultiLineEditor from "./MultiLineEditor";

export const columnTypes = {
  TYPE_COL: 1,
  DOMAIN_COL: 2,
  SUBDOMAIN_COL: 3,
  DESC_COL: 4,
  PROP_TOKEN_COL: 5,
  LABOR_COL: 6,
  EXP_COL: 7
};

const { LABOR_COL, EXP_COL } = columnTypes;

const getDropdownOptionsByColumnType = colType => {
  const domainOptions = [
    "Development",
    "Marketing",
    "Design",
    "Research",
    "Documentation",
    "Community Management"
  ];
  const mapColTypeToOptions = {
    [columnTypes.TYPE_COL]: [
      {
        label: "Labor",
        value: 1
      },
      {
        label: "Expense",
        value: 2
      },
      {
        label: "Misc",
        value: 3
      }
    ],
    [columnTypes.DOMAIN_COL]: domainOptions.map(op => ({
      value: op,
      label: op
    }))
  };

  return mapColTypeToOptions[colType];
};

export const selectWrapper = options => props => (
  <SelectEditor {...{ ...props, options }} />
);

export const multiLineWrapper = props => <MultiLineEditor {...{ ...props }} />;

export const generateBlankLineItem = () => ({
  type: 1,
  domain: "",
  subdomain: "",
  description: "",
  proposaltoken: "",
  labor: "",
  expenses: ""
});

export const convertLineItemsToGrid = (lineItems, readOnly = true) => {
  const grid = [createTableHeaders()];
  const { grid: gridBody, expenseTotal, laborTotal } = lineItems.reduce(
    (acc, line, idx) => {
      const isLabelReadonly =
        line.type === 2 ? true : line.type === 3 ? true : readOnly;
      const isExpenseReadonly = line.type === 1 ? true : readOnly;
      const newLine = [
        { readOnly: true, value: idx + 1 },
        {
          readOnly,
          value: line.type,
          dataEditor: selectWrapper(
            getDropdownOptionsByColumnType(columnTypes.TYPE_COL)
          )
        },
        {
          readOnly,
          value: line.domain,
          dataEditor: selectWrapper(
            getDropdownOptionsByColumnType(columnTypes.DOMAIN_COL)
          )
        },
        { readOnly, value: line.subdomain },
        {
          readOnly,
          value: line.description,
          dataEditor: multiLineWrapper,
          className: "description"
        },
        { readOnly, value: line.proposaltoken },
        { readOnly: isLabelReadonly, value: fromMinutesToHours(line.labor) },
        {
          readOnly: isExpenseReadonly,
          value: fromUSDCentsToUSDUnits(line.expenses)
        }
      ];
      return {
        grid: acc.grid.concat([newLine]),
        expenseTotal: acc.expenseTotal + line.expenses,
        laborTotal: acc.laborTotal + line.labor
      };
    },
    { grid: [], expenseTotal: 0, laborTotal: 0 }
  );
  const totalsLine = [
    { readOnly: true },
    { readOnly: true },
    { readOnly: true },
    { readOnly: true },
    { readOnly: true },
    {
      readOnly: true,
      component: <span className="total-label">Total</span>,
      forceComponent: true
    },
    {
      readOnly: true,
      value: (
        <span className="total-label">{fromMinutesToHours(laborTotal)}</span>
      )
    },
    {
      readOnly: true,
      value: (
        <span className="total-label">
          {fromUSDCentsToUSDUnits(expenseTotal)}
        </span>
      )
    }
  ];
  return grid.concat(gridBody).concat([totalsLine]);
};

export const convertGridToLineItems = grid => {
  const copyGrid = grid.map(row => [...row]);
  return copyGrid.reduce((acc, rowValues, row) => {
    // skip first and last rows
    if (row === 0 || row === copyGrid.length - 1) return acc;

    const lineItem = rowValues.reduce((acc, cell, col) => {
      switch (col) {
        case columnTypes.TYPE_COL:
          return { ...acc, type: +cell.value };
        case columnTypes.DOMAIN_COL:
          return { ...acc, domain: cell.value };
        case columnTypes.SUBDOMAIN_COL:
          return { ...acc, subdomain: cell.value };
        case columnTypes.DESC_COL:
          return { ...acc, description: cell.value };
        case columnTypes.PROP_TOKEN_COL:
          return { ...acc, proposaltoken: cell.value };
        case columnTypes.LABOR_COL:
          return { ...acc, labor: fromHoursToMinutes(+cell.value) };
        case columnTypes.EXP_COL:
          return { ...acc, expenses: fromUSDUnitsToUSDCents(+cell.value) };
        default:
          return acc;
      }
    }, {});

    return acc.concat([lineItem]);
  }, []);
};

export const createTableHeaders = () => [
  { readOnly: true, value: "", width: 20 },
  { value: "Type", width: 120, readOnly: true },
  { value: "Domain", readOnly: true },
  { value: "Subdomain", readOnly: true },
  { value: "Description", readOnly: true },
  { value: "Proposal Token", readOnly: true },
  { value: "Labor (hours)", width: 60, readOnly: true },
  { value: "Expense (USD)", width: 60, readOnly: true }
];

export const updateGridCell = (grid, row, col, values) => {
  grid[row][col] = { ...grid[row][col], ...values };
  return grid;
};

export const processTypeColChange = (grid, { row, col, value }) => {
  // if value is 1, the expense column must be 0, so we set it to readOnly
  if (+value === 1) {
    grid = updateGridCell(grid, row, EXP_COL, { value: 0, readOnly: true });
  } else {
    // if it is not 1, we make sure it is not readOnly
    grid = updateGridCell(grid, row, EXP_COL, { readOnly: false });
  }

  // if value is 2, the labor column must be 0, so we set it to readOnly
  if (+value === 2 || +value === 3) {
    grid = updateGridCell(grid, row, LABOR_COL, { value: 0, readOnly: true });
  } else {
    // if it is not 2, we make sure it is not readOnly
    grid = updateGridCell(grid, row, LABOR_COL, { readOnly: false });
  }

  return updateGridCell(grid, row, col, { value });
};

export const processCellsChange = (currentGrid, changes) => {
  return changes.reduce(
    (acc, change) => {
      switch (change.col) {
        case columnTypes.TYPE_COL:
          acc.grid = processTypeColChange(acc.grid, change);
          return acc;
        default:
          acc.grid = updateGridCell(acc.grid, change.row, change.col, {
            value: change.value
          });
          return acc;
      }
    },
    { grid: currentGrid }
  );
};
