export const columnTypes = {
  TYPE_COL: 1,
  DOMAIN_COL: 2,
  SUBDOMAIN_COL: 3,
  DESC_COL: 4,
  PROP_TOKEN_COL: 5,
  LABOR_COL: 6,
  EXP_COL: 7
};

const {
  //   TYPE_COL,
  //   DOMAIN_COL,
  //   SUBDOMAIN_COL,
  //   DESC_COL,
  //   PROP_TOKEN_COL,
  LABOR_COL,
  EXP_COL
} = columnTypes;

// TODO: get this values dinamically from the api policy
const MIN_STRING_LEN = 3;
const MAX_STRING_LEN = 50;

export const createTableHeaders = () => [
  { readOnly: true, value: "" },
  { value: "Type", width: 40, readOnly: true },
  { value: "Domain", readOnly: true },
  { value: "Subdomain", readOnly: true },
  { value: "Description", readOnly: true },
  { value: "Proposal Token", readOnly: true },
  { value: "Labor", width: 40, readOnly: true },
  { value: "Expense", width: 40, readOnly: true }
];

export const createNewRow = rowNum => {
  return [
    { readOnly: true, value: rowNum },
    { value: 1 },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: 0 },
    { value: 0, readOnly: true }
  ];
};

export const errors = {
  InvalidType: 1,
  InvalidDomainLen: 2,
  InvalidSubdomainLen: 3,
  InvalidDescriptionLen: 4
};

export const errorsMessage = {
  [errors.InvalidType]: "Type must be either 1, 2 or 3",
  [errors.InvalidDomainLen]: "Domain must have between 3 and 50 chars",
  [errors.InvalidSubdomainLen]: "Subomain must have between 3 and 50 chars",
  [errors.InvalidDescriptionLen]: "Description must have between 3 and 50 chars"
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
    // grid[row][col] = { ...grid[row][col], value: "" };
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
  if (+value === 2) {
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
