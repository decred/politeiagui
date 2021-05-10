import {
  fromHoursToMinutes,
  fromUSDCentsToUSDUnits,
  fromMinutesToHours,
  fromUSDUnitsToUSDCents
} from "../../helpers";
import {
  selectWrapper,
  textAreaWrapper,
  multilineTextWrapper,
  singlelineTextWrapper,
  textWithErrorWrapper
} from "./wrappers";
import find from "lodash/find";

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
  SUBCONTRACTOR_COL,
  SUBRATE_COL,
  LABOR_COL,
  EXP_COL,
  SUBTOTAL_COL
} = columnTypes;

const capitalizeFirstLetter = (string) =>
  string[0].toUpperCase() + string.substring(1);

const defaultLineItemTypeOption = (policyLineItemTypes) =>
  policyLineItemTypes[0].type;

const getSubcontractorOptions = (subContractors) =>
  subContractors
    ? subContractors.map((sc) => ({
        value: sc.id,
        label: sc.username
      }))
    : [];

const defaultDomainOption = (policyDomains) =>
  capitalizeFirstLetter(policyDomains[0].description);

export const generateBlankLineItem = (policy) => ({
  type: defaultLineItemTypeOption(policy.supportedlineitemtypes),
  domain: defaultDomainOption(policy.supporteddomains),
  subdomain: "",
  description: "",
  proposaltoken: "",
  labor: 0,
  expenses: 0,
  subtotal: "",
  subuserid: "",
  subrate: 0
});

export const getTotalsLine = (lineLength, totals, commonProps = {}) =>
  lineLength > totals.length
    ? [
        ...new Array(lineLength - totals.length).fill(commonProps),
        ...totals.map((item) => ({ ...item, ...commonProps }))
      ]
    : totals;

export const convertLineItemsToGrid = (
  lineItems,
  readOnly = true,
  errors,
  userRate = 0,
  policy,
  proposals,
  subContractors,
  proposalsError,
  subContractorsError
) => {
  const {
    supporteddomains: policyDomains,
    supportedlineitemtypes: policyLineItemTypes,
    invoicefieldsupportedchars: policySupportedChars
  } = policy;
  const grid = [];
  const {
    grid: gridBody,
    expenseTotal,
    laborTotal,
    total
  } = lineItems.reduce(
    (acc, line, idx) => {
      const newLine = line;
      const isLaborReadonly =
        newLine.type === 2 ? true : newLine.type === 3 ? true : readOnly;
      const isSubContractorReadonly = newLine.type !== 4 ? true : readOnly;
      const isExpenseReadonly =
        newLine.type === 1 || newLine.type === 4 ? true : readOnly;
      const subUser = find(subContractors, { id: newLine.subuserid });
      const subContractorValue = isSubContractorReadonly
        ? subUser && subUser.username
        : newLine.subuserid;
      const typeValue = policyLineItemTypes.find(
        (t) => t.type === newLine.type
      );
      const laborHours = +fromMinutesToHours(newLine.labor);
      const expenses = +fromUSDCentsToUSDUnits(newLine.expenses);
      const subRate = +fromUSDCentsToUSDUnits(newLine.subrate);
      const lineSubTotal =
        newLine.type !== 4
          ? laborHours * userRate + expenses
          : laborHours * subRate;
      const rowErrors = (errors && errors[idx]) || {};
      const tableLine = [
        { readOnly: true, value: idx + 1 },
        {
          readOnly,
          value: newLine.type,
          error: rowErrors && rowErrors.type,
          valueViewer: () =>
            typeValue ? capitalizeFirstLetter(typeValue.description) : "",
          dataEditor: selectWrapper(
            policyLineItemTypes.map((op) => ({
              value: op.type,
              label: capitalizeFirstLetter(op.description)
            }))
          )
        },
        {
          readOnly,
          value: newLine.domain,
          error: rowErrors && rowErrors.domain,
          dataEditor: selectWrapper(
            policyDomains.map((op) => ({
              value: capitalizeFirstLetter(op.description),
              label: capitalizeFirstLetter(op.description)
            }))
          )
        },
        {
          readOnly,
          value: line.subdomain,
          error: rowErrors && rowErrors.subdomain,
          valueViewer: singlelineTextWrapper(policySupportedChars)
        },
        {
          readOnly,
          value: newLine.description,
          error: rowErrors && rowErrors.description,
          dataEditor: textAreaWrapper({
            error: rowErrors && rowErrors.description
          }),
          valueViewer: multilineTextWrapper(policySupportedChars)
        },
        {
          readOnly,
          value: newLine.proposaltoken,
          error: rowErrors && rowErrors.proposaltoken,
          valueViewer: textWithErrorWrapper(
            proposalsError,
            proposals ? proposals.map((p) => p.censorshiprecord.token) : []
          )
        },
        {
          readOnly: isSubContractorReadonly,
          value: subContractorValue,
          error: rowErrors && rowErrors.subuserid,
          dataEditor: selectWrapper(getSubcontractorOptions(subContractors)),
          valueViewer: textWithErrorWrapper(subContractorsError)
        },
        {
          readOnly: isSubContractorReadonly,
          error: rowErrors && rowErrors.subrate,
          value: +fromUSDCentsToUSDUnits(newLine.subrate)
        },
        {
          readOnly: isLaborReadonly,
          value: laborHours,
          error: rowErrors && rowErrors.labor
        },
        {
          readOnly: isExpenseReadonly,
          value: expenses,
          error: rowErrors && rowErrors.expenses
        },
        {
          readOnly: true,
          value: parseFloat(lineSubTotal).toFixed(2)
        }
      ];
      return {
        grid: acc.grid.concat([tableLine.filter(Boolean)]),
        expenseTotal: acc.expenseTotal + newLine.expenses,
        laborTotal: acc.laborTotal + newLine.labor,
        total: parseFloat(+acc.total + lineSubTotal).toFixed(2)
      };
    },
    { grid: [], expenseTotal: 0, laborTotal: 0, total: 0 }
  );

  const totals = [
    { value: "Total", forceComponent: true },
    { value: +fromMinutesToHours(laborTotal) },
    { value: +fromUSDCentsToUSDUnits(expenseTotal) },
    { value: total }
  ];

  const totalsLine = getTotalsLine(gridBody[0].length, totals, {
    readOnly: true
  });
  return grid.concat(gridBody).concat([totalsLine]);
};

export const convertGridToLineItems = (grid) => {
  const copyGrid = grid.map((row) => [...row]);
  return copyGrid.reduce((acc, rowValues, row) => {
    // skip last row
    if (row === copyGrid.length - 1) return acc;

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

export const createTableHeaders = (isMobileScreen) =>
  !isMobileScreen
    ? [
        { value: "", readOnly: true, width: "2rem" },
        { value: "Type", readOnly: true, width: "10rem" },
        { value: "Domain", readOnly: true, width: "12rem" },
        { value: "Subdomain", readOnly: true, width: "14rem" },
        { value: "Description", readOnly: true, width: "30rem" },
        { value: "Proposal", readOnly: true, width: "30rem" },
        { value: "Subcontr. ID", readOnly: true, width: "10rem" },
        { value: "Subcontr. Rate (USD)", readOnly: true, width: "8rem" },
        { value: "Labor (hours)", readOnly: true, width: "7rem" },
        { value: "Expense (USD)", readOnly: true, width: "7.5rem" },
        { value: "Subtotal (USD)", readOnly: true, width: "7.5rem" }
      ]
    : [
        { value: "", readOnly: true, width: "2rem" },
        { value: "Type", readOnly: true, width: "7rem" },
        { value: "Domain", readOnly: true, width: "9rem" },
        { value: "Subdomain", readOnly: true, width: "10rem" },
        { value: "Description", readOnly: true, width: "20rem" },
        { value: "Proposal", readOnly: true, width: "20rem" },
        { value: "Sub. ID", readOnly: true, width: "5rem" },
        { value: "Sub. Rate (USD)", readOnly: true, width: "7.5rem" },
        { value: "Labor (hours)", readOnly: true, width: "7rem" },
        { value: "Expense (USD)", readOnly: true, width: "7.5rem" },
        { value: "Subtotal (USD)", readOnly: true, width: "7.5rem" }
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

  // if value is 4, the expense column must be 0 and readOnly
  if (+value === 4) {
    grid = updateGridCell(grid, row, SUBCONTRACTOR_COL, { readOnly: false });
    grid = updateGridCell(grid, row, SUBRATE_COL, {
      value: 0,
      readOnly: false
    });
    grid = updateGridCell(grid, row, EXP_COL, { readOnly: true });
  } else {
    grid = updateGridCell(grid, row, SUBCONTRACTOR_COL, { value: "" });
    grid = updateGridCell(grid, row, SUBRATE_COL, { value: 0 });
  }

  return updateGridCell(grid, row, col, { value });
};

export const processSubRateColChange = (grid, { row, col, value }) => {
  const labor = grid[row][columnTypes.LABOR_COL].value;
  grid = updateGridCell(grid, row, SUBTOTAL_COL, { value: value * labor });
  return updateGridCell(grid, row, col, { value });
};

export const processLaborColChange = (grid, { row, col, value }, userRate) => {
  // updates subtotal upon labor value entry
  const type = grid[row][columnTypes.TYPE_COL].value;
  const subRate = grid[row][columnTypes.SUBRATE_COL].value;

  // user rate
  if (type === 1) {
    grid = updateGridCell(grid, row, SUBTOTAL_COL, { value: value * userRate });
  }

  // sub contractor rate
  if (type === 4) {
    grid = updateGridCell(grid, row, SUBTOTAL_COL, { value: value * subRate });
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
    const row = g[0].value - 1;
    const type = g[columnTypes.TYPE_COL].value;
    const value = g[columnTypes.LABOR_COL].value;
    const subRate = g[columnTypes.SUBRATE_COL].value;

    if (type === 1) {
      grid = updateGridCell(grid, row, SUBTOTAL_COL, {
        value: value * userRate
      });
    }

    if (type === 4) {
      grid = updateGridCell(grid, row, SUBTOTAL_COL, {
        value: value * subRate
      });
    }
  }
  return grid;
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

export const getProposalsOptions = (proposals = []) =>
  proposals.map((p) => ({ label: p.name, value: p.censorshiprecord.token }));
