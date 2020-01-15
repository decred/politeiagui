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
  SUBCONTRACTOR_COL: 6,
  SUBRATE_COL: 7,
  LABOR_COL: 8,
  EXP_COL: 9,
  SUBTOTAL_COL: 10
};

export const {
  LABOR_COL,
  EXP_COL,
  SUBTOTAL_COL,
  SUBCONTRACTOR_COL,
  SUBRATE_COL
} = columnTypes;

const getDropdownOptionsByColumnType = (colType) => {
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
      },
      {
        label: "Sub-contractor",
        value: 4
      }
    ],
    [columnTypes.DOMAIN_COL]: domainOptions.map((op) => ({
      value: op,
      label: op
    }))
  };

  return mapColTypeToOptions[colType];
};

const getSubcontractorOptions = (subcontractors) =>
  subcontractors.map((sc) => ({
    value: sc.id,
    label: sc.username
  }));

export const selectWrapper = (options) => (props) => (
  <SelectEditor {...{ ...props, options }} />
);

export const multiLineWrapper = (props) => (
  <MultiLineEditor {...{ ...props }} />
);

export const generateBlankLineItem = () => ({
  type: 1,
  domain: "",
  subdomain: "",
  description: "",
  proposaltoken: "",
  labor: 0,
  expenses: "",
  subtotal: "",
  subuserid: "",
  subrate: 0
});

export const convertLineItemsToGrid = (
  lineItems,
  readOnly = true,
  subcontractors = []
) => {
  const grid = [createTableHeaders()];
  const { grid: gridBody, expenseTotal, laborTotal, total } = lineItems.reduce(
    (acc, line, idx) => {
      const isLabelReadonly =
        line.type === 2 ? true : line.type === 3 ? true : readOnly;
      const isSubContractorReadonly = line.type !== 4 ? true : readOnly;
      const isExpenseReadonly =
        line.type === 1 ? true : line.type === 4 ? true : readOnly;
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
          className: "multiline-cell-value"
        },
        {
          readOnly,
          value: line.proposaltoken,
          dataEditor: multiLineWrapper,
          className: "multiline-cell-value"
        },
        {
          readOnly: isSubContractorReadonly,
          value: line.subuserid,
          dataEditor: selectWrapper(getSubcontractorOptions(subcontractors))
        },
        {
          readOnly: isSubContractorReadonly,
          value: +fromUSDCentsToUSDUnits(line.subrate)
        },
        { readOnly: isLabelReadonly, value: +fromMinutesToHours(line.labor) },
        {
          readOnly: isExpenseReadonly,
          value: +fromUSDCentsToUSDUnits(line.expenses)
        },
        {
          readOnly: true,
          value: line.subtotal
        }
      ];
      return {
        grid: acc.grid.concat([newLine]),
        expenseTotal: acc.expenseTotal + line.expenses,
        laborTotal: acc.laborTotal + line.labor,
        total: acc.total + line.subtotal
      };
    },
    { grid: [], expenseTotal: 0, laborTotal: 0, total: 0 }
  );
  const totalsLine = [
    { readOnly: true },
    { readOnly: true },
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
        <span className="total-label">{+fromMinutesToHours(laborTotal)}</span>
      )
    },
    {
      readOnly: true,
      value: (
        <span className="total-label">
          {+fromUSDCentsToUSDUnits(expenseTotal)}
        </span>
      )
    },
    {
      readOnly: true,
      value: <span className="total-label">{total}</span>
    }
  ];
  return grid.concat(gridBody).concat([totalsLine]);
};

export const convertGridToLineItems = (grid) => {
  const copyGrid = grid.map((row) => [...row]);
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
        case columnTypes.SUBCONTRACTOR_COL:
          return { ...acc, subuserid: cell.value };
        case columnTypes.SUBRATE_COL:
          return { ...acc, subrate: fromUSDUnitsToUSDCents(+cell.value) };
        case columnTypes.LABOR_COL:
          return { ...acc, labor: fromHoursToMinutes(+cell.value) };
        case columnTypes.EXP_COL:
          return { ...acc, expenses: fromUSDUnitsToUSDCents(+cell.value) };
        case columnTypes.SUBTOTAL_COL:
          return { ...acc, subtotal: +cell.value };
        default:
          return acc;
      }
    }, {});

    return acc.concat([lineItem]);
  }, []);
};

export const lineitemsWithSubtotal = (lineItems, rate) =>
  lineItems.map((l) => {
    return l.type === 1
      ? {
          ...l,
          subtotal: +fromMinutesToHours(l.labor) * +fromUSDCentsToUSDUnits(rate)
        }
      : l.type === 4
      ? {
          ...l,
          subtotal:
            +fromMinutesToHours(l.labor) * +fromUSDCentsToUSDUnits(l.subrate)
        }
      : {
          ...l,
          subtotal: +fromUSDCentsToUSDUnits(l.expenses)
        };
  });

export const createTableHeaders = () => [
  { readOnly: true, value: "", width: 25 },
  { value: "Type", width: 120, readOnly: true },
  { value: "Domain", width: 175, readOnly: true },
  { value: "Subdomain", width: 175, readOnly: true },
  { value: "Description", readOnly: true },
  { value: "Proposal Token", readOnly: true },
  { value: "Sub Contractor ID", readOnly: true },
  { value: "Sub Contractor Rate (USD)", width: 100, readOnly: true },
  { value: "Labor (hours)", width: 60, readOnly: true },
  { value: "Expense (USD)", width: 60, readOnly: true },
  { value: "Subtotal (USD)", width: 60, readOnly: true }
];

export const updateGridCell = (grid, row, col, values) => {
  grid[row][col] = { ...grid[row][col], ...values };
  return grid;
};

export const processTypeColChange = (grid, { row, col, value }) => {
  // if value is 1, the expense column must be 0, so we set it to readOnly
  if (+value === 1) {
    grid = updateGridCell(grid, row, EXP_COL, { value: 0, readOnly: true });
    grid = updateGridCell(grid, row, SUBRATE_COL, {
      value: 0,
      readOnly: false
    });
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

  if (+value === 4) {
    grid = updateGridCell(grid, row, SUBCONTRACTOR_COL, { readOnly: false });
    grid = updateGridCell(grid, row, EXP_COL, { value: 0, readOnly: true });
  }

  return updateGridCell(grid, row, col, { value });
};

export const processLaborColChange = (grid, { row, col, value }, userRate) => {
  // updates subtotal upon labor value entry considering the lineitem type,
  // in order to decide whether to use subrate or userRate
  const line = grid[row];
  const type = line[columnTypes.TYPE_COL].value;
  const subrate = line[columnTypes.SUBRATE_COL].value;

  if (type === 4) {
    grid = updateGridCell(grid, row, SUBTOTAL_COL, {
      value: value * subrate
    });
  }

  if (type === 1) {
    grid = updateGridCell(grid, row, SUBTOTAL_COL, {
      value: value * userRate
    });
  }
  return updateGridCell(grid, row, col, { value });
};

export const processExpenseColChange = (grid, { row, col, value }) => {
  // updates subtotal upon expense value entry
  grid = updateGridCell(grid, row, SUBTOTAL_COL, { value: value });
  return updateGridCell(grid, row, col, { value });
};

export const processSubtotalColChange = (grid, userRate) => {
  // case where user rate changes and grid must recalculate subtotal
  for (const g of grid) {
    const row = g[0].value;
    const type = g[columnTypes.TYPE_COL].value;
    const value = g[columnTypes.LABOR_COL].value;
    const subrate = g[columnTypes.SUBRATE_COL].value;

    if (type === 1) {
      grid = updateGridCell(grid, row, SUBTOTAL_COL, {
        value: value * userRate
      });
    }
    if (type === 4) {
      grid = updateGridCell(grid, row, SUBTOTAL_COL, {
        value: value * subrate
      });
    }
  }
  return grid;
};

export const processSubRateColChange = (grid, { row, col, value }) => {
  const labor = grid[row][columnTypes.LABOR_COL].value;
  grid = updateGridCell(grid, row, SUBTOTAL_COL, {
    value: value * labor
  });
  return updateGridCell(grid, row, col, { value });
};

export const processCellsChange = (currentGrid, changes, userRate = 0) => {
  return changes.reduce(
    (acc, change) => {
      switch (change.col) {
        case columnTypes.TYPE_COL:
          acc.grid = processTypeColChange(acc.grid, change);
          return acc;
        case columnTypes.LABOR_COL:
          acc.grid = processLaborColChange(acc.grid, change, userRate);
          return acc;
        case columnTypes.EXP_COL:
          acc.grid = processExpenseColChange(acc.grid, change);
          return acc;
        case columnTypes.SUBRATE_COL:
          acc.grid = processSubRateColChange(acc.grid, change);
          return acc;
        case columnTypes.SUBTOTAL_COL:
          acc.grid = processSubtotalColChange(acc.grid, userRate);
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
