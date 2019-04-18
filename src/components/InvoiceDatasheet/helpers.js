export const convertLineItemsToGrid = (lineItems, readOnly = true) => {
  const grid = [createTableHeaders()];
  const gridBody = lineItems.map((line, idx) => {
    const isLabelReadonly =
      line.type === 2 ? true : line.type === 3 ? true : readOnly;
    const isExpenseReadonly = line.type === 1 ? true : readOnly;
    return [
      { readOnly: true, value: idx + 1 },
      { readOnly, value: line.type },
      { readOnly, value: line.domain },
      { readOnly, value: line.subdomain },
      { readOnly, value: line.description },
      { readOnly, value: line.proposaltoken },
      { readOnly: isLabelReadonly, value: line.labor },
      { readOnly: isExpenseReadonly, value: line.expenses }
    ];
  });
  return grid.concat(gridBody);
};

export const convertGridToLineItems = grid => {
  const copyGrid = grid.map(row => [...row]);
  return copyGrid.reduce((acc, rowValues, row) => {
    // skip first row as it is exclusive for table headers
    if (row === 0) return acc;

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
          return { ...acc, labor: +cell.value };
        case columnTypes.EXP_COL:
          return { ...acc, expenses: +cell.value };
        default:
          return acc;
      }
    }, {});

    return acc.concat([lineItem]);
  }, []);
};

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

// TODO: get this values dinamically from the api policy
const MIN_STRING_LEN = 3;
const MAX_STRING_LEN = 50;

export const createTableHeaders = () => [
  { readOnly: true, value: "", width: 10 },
  { value: "Type", width: 40, readOnly: true },
  { value: "Domain", readOnly: true },
  { value: "Subdomain", readOnly: true },
  { value: "Description", readOnly: true },
  { value: "Proposal Token", readOnly: true },
  { value: "Labor", width: 60, readOnly: true },
  { value: "Expense", width: 60, readOnly: true }
];

export const createNewRow = rowNum => {
  return [
    { readOnly: true, value: rowNum },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" }
  ];
};

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
  [errors.InvalidLaborValue]: "Labor value must be an integer",
  [errors.InvalidLaborAmount]:
    "If Type is 1, labor value must be greater than 0",
  [errors.InvalidExpenseValue]: "Expense value must be an integer",
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

const validateStringLength = value => {
  if (value.length < MIN_STRING_LEN || value.length > MAX_STRING_LEN) {
    return false;
  }
  return true;
};

export const processStringColChange = (grid, { row, col, value }) => {
  if (!validateStringLength(value)) {
    return response(
      errors.InvalidDomainLen,
      updateGridCell(grid, row, col, {
        value: ""
      })
    );
  }

  return response(null, updateGridCell(grid, row, col, { value }));
};

export const processDomainColChange = (grid, { row, col, value }) => {
  if (!validateStringLength(value)) {
    return response(
      errors.InvalidDomainLen,
      updateGridCell(grid, row, col, {
        value: value
      })
    );
  }

  return response(null, updateGridCell(grid, row, col, { value }));
};

export const processSubdomainColChange = (grid, { row, col, value }) => {
  if (!validateStringLength(value)) {
    return response(
      errors.InvalidSubdomainLen,
      updateGridCell(grid, row, col, {
        value: value
      })
    );
  }

  return response(null, updateGridCell(grid, row, col, { value }));
};

export const processDescriptionColChange = (grid, { row, col, value }) => {
  if (!validateStringLength(value)) {
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
  const intValue = parseInt(value, 10);
  // make sure the value can be converted to an integer
  if (intValue !== 0 && !intValue) {
    return response(
      errors.InvalidLaborValue,
      updateGridCell(grid, row, col, {
        value: ""
      })
    );
  }

  // make sure labor is different than 0 if type is equal 1
  if (grid[row][TYPE_COL].value === "1" && intValue <= 0) {
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
      value: value
    })
  );
};

export const processExpenseColChange = (grid, { row, col, value }) => {
  const intValue = parseInt(value, 10);
  // make sure the value can be converted to an integer
  if (intValue !== 0 && !intValue) {
    return response(
      errors.InvalidExpenseValue,
      updateGridCell(grid, row, col, {
        value: ""
      })
    );
  }

  // make sure expense is different than 0 if type is equal 2
  if (grid[row][TYPE_COL].value === "2" && intValue <= 0) {
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
      value: value
    })
  );
};

export const processCellsChange = (currentGrid, changes) => {
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
    { grid: currentGrid, errors: new Set() }
  );
};
