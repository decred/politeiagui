import React from "react";
import {
  fromHoursToMinutes,
  fromUSDCentsToUSDUnits,
  fromMinutesToHours,
  fromUSDUnitsToUSDCents
} from "../../helpers";
import SelectEditor from "./SelectEditor";

export const columnTypes = {
  TYPE_COL: 1,
  DOMAIN_COL: 2,
  SUBDOMAIN_COL: 3,
  DESC_COL: 4,
  PROP_TOKEN_COL: 5,
  LABOR_COL: 6,
  EXP_COL: 7
};

const { TYPE_COL, LABOR_COL, EXP_COL } = columnTypes;

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

export const generateBlankLineItem = () => ({
  type: "",
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
        { readOnly, value: line.description },
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

export const errors = {
  InvalidType: 1,
  InvalidDomainLen: 2,
  InvalidSubdomainLen: 3,
  InvalidDescriptionLen: 4,
  InvalidPropTokenLen: 5,
  InvalidLaborValue: 6,
  InvalidLaborAmount: 7,
  InvalidExpenseValue: 8,
  InvalidExpenseAmount: 9
};

export const errorsMessage = {
  [errors.InvalidType]: "Type must be either 1, 2 or 3",
  [errors.InvalidDomainLen]: "Domain must have between 3 and 50 chars",
  [errors.InvalidSubdomainLen]: "Subomain must have between 3 and 50 chars",
  [errors.InvalidDescriptionLen]:
    "Description must have between 3 and 50 chars",
  [errors.InvalidPropTokenLen]: "Proposals tokens must be 64 characters long",
  [errors.InvalidLaborValue]: "Labor value must be a number",
  [errors.InvalidLaborAmount]:
    "If Type is 1, labor value must be greater than 0",
  [errors.InvalidExpenseValue]: "Expense value must be a number",
  [errors.InvalidExpenseAmount]:
    "If Type is 2, expense value must be greater than 0"
};

const response = (error, newValue) => ({
  error,
  newValue
});

export const updateGridCell = (grid, row, col, values) => {
  grid[row][col] = { ...grid[row][col], ...values };
  return grid;
};

export const processTypeColChange = (grid, { row, col, value }) => {
  const validTypeValues = [1, 2, 3];
  const valueIsValid = validTypeValues.find(v => v === +value);
  // validate if the value
  if (!valueIsValid) {
    return response(
      errors.InvalidType,
      updateGridCell(grid, row, col, {
        value: ""
      })
    );
  }

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

  return response(null, updateGridCell(grid, row, col, { value }));
};

const validateStringLength = (policy, value) => {
  if (
    value.length < policy.minlineitemcollength ||
    value.length > policy.maxlineitemcollength
  ) {
    return false;
  }
  return true;
};

export const processStringColChange = (policy, grid, { row, col, value }) => {
  if (!validateStringLength(policy, value)) {
    return response(
      errors.InvalidDomainLen,
      updateGridCell(grid, row, col, {
        value: ""
      })
    );
  }

  return response(null, updateGridCell(grid, row, col, { value }));
};

export const processDomainColChange = (policy, grid, { row, col, value }) => {
  if (!validateStringLength(policy, value)) {
    return response(
      errors.InvalidDomainLen,
      updateGridCell(grid, row, col, {
        value: value
      })
    );
  }

  return response(null, updateGridCell(grid, row, col, { value }));
};

export const processSubdomainColChange = (
  policy,
  grid,
  { row, col, value }
) => {
  if (!validateStringLength(policy, value)) {
    return response(
      errors.InvalidSubdomainLen,
      updateGridCell(grid, row, col, {
        value: value
      })
    );
  }

  return response(null, updateGridCell(grid, row, col, { value }));
};

export const processDescriptionColChange = (
  policy,
  grid,
  { row, col, value }
) => {
  if (!validateStringLength(policy, value)) {
    return response(
      errors.InvalidDescriptionLen,
      updateGridCell(grid, row, col, {
        value: value
      })
    );
  }

  return response(null, updateGridCell(grid, row, col, { value }));
};

export const processPropTokenColChange = (grid, { row, col, value }) => {
  const updatedGrid = updateGridCell(grid, row, col, {
    value: value
  });
  // proposal token can be either blank or have a valid token
  if (!value) {
    return response(null, updatedGrid);
  }

  // for now only validate the token length
  if (value.length < 64) {
    return response(errors.InvalidPropTokenLen, updatedGrid);
  }

  return updatedGrid;
};

export const processLaborColChange = (grid, { row, col, value }) => {
  const floatValue = parseFloat(value, 10).toFixed(2);

  // make sure the value can be converted to a valid number
  const invalidNumber = !floatValue || isNaN(floatValue);
  if (invalidNumber) {
    return response(
      errors.InvalidLaborValue,
      updateGridCell(grid, row, col, {
        value: ""
      })
    );
  }

  // make sure labor is different than 0 if type is equal 1
  const typeColValue = grid[row][TYPE_COL].value;
  const isTypeOne = parseInt(typeColValue, 10) === 1;
  if (isTypeOne && +floatValue <= 0) {
    return response(
      errors.InvalidLaborAmount,
      updateGridCell(grid, row, col, {
        value: 1
      })
    );
  }

  return response(
    null,
    updateGridCell(grid, row, col, {
      value: floatValue
    })
  );
};

export const processExpenseColChange = (grid, { row, col, value }) => {
  const floatValue = parseFloat(value, 10).toFixed(2);

  const invalidNumber = !floatValue || isNaN(floatValue);

  if (invalidNumber) {
    return response(
      errors.InvalidExpenseValue,
      updateGridCell(grid, row, col, {
        value: ""
      })
    );
  }

  // make sure expense is different than 0 if type is equal 2
  const typeColValue = grid[row][TYPE_COL].value;
  const isTypeTwo = parseInt(typeColValue, 10) === 2;
  if (isTypeTwo && +floatValue <= 0) {
    return response(
      errors.InvalidExpenseAmount,
      updateGridCell(grid, row, col, {
        value: 1
      })
    );
  }

  return response(
    null,
    updateGridCell(grid, row, col, {
      value: floatValue
    })
  );
};

export const processCellsChange = (policy, currentGrid, changes) => {
  let result = null;
  const getGridAndErrorsFromResult = (acc, result) => ({
    grid: result.newValue,
    errors: result.error ? acc.errors.add(result.error) : acc.errors
  });

  return changes.reduce(
    (acc, change) => {
      switch (change.col) {
        case columnTypes.TYPE_COL:
          result = processTypeColChange(acc.grid, change);
          return getGridAndErrorsFromResult(acc, result);
        case columnTypes.DOMAIN_COL:
          result = processDomainColChange(policy, acc.grid, change);
          return getGridAndErrorsFromResult(acc, result);
        case columnTypes.SUBDOMAIN_COL:
          result = processSubdomainColChange(policy, acc.grid, change);
          return getGridAndErrorsFromResult(acc, result);
        case columnTypes.DESC_COL:
          result = processDescriptionColChange(policy, acc.grid, change);
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
    { grid: currentGrid, errors: new Set() }
  );
};
