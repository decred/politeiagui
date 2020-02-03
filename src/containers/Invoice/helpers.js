import { getCurrentMonth, getCurrentYear } from "src/helpers";
import { INVOICE_STATUS_NEW, INVOICE_STATUS_UPDATED } from "./constants";

/**
 * Returns the previous month (and year) to be used as initial start date in date range
 * @returns {Object} { year, month}
 */
export const getPreviousMonthDateValue = () => {
  const { month, year } = getInitialDateValue();
  return getLastMonth(month, year);
};

export const getCurrentDateValue = () => {
  return {
    month: getCurrentMonth(),
    year: getCurrentYear()
  };
};

/**
 * Returns the initial month and year to be applied to a blank invoice form
 * @returns {Object} { year, month}
 */
export const getInitialDateValue = () => {
  const currYear = getCurrentYear();
  const currMonth = getCurrentMonth();

  return getLastMonth(currMonth, currYear);
};

/**
 * Gets current month & year and calculates last month
 * @returns {Object} { year, month}
 */
const getLastMonth = (month, year) => {
  // case is december
  if (month === 1) {
    return {
      year: year - 1,
      month: 12
    };
  }

  return {
    year,
    month: month - 1
  };
};

/**
 * Returns the range of years and months allowed for selection
 * @returns {Object} { min, max }
 */
export const getMinMaxYearAndMonth = () => {
  const min = { year: 2018, month: 1 };
  return {
    min,
    max: getInitialDateValue()
  };
};

/**
 * Returns a presentational name for a given invoice based on the contractor
 * name, month and year
 * @param {Object} invoice
 */
export const presentationalInvoiceName = (invoice) =>
  invoice && invoice.input
    ? `Invoice from ${invoice.input.contractorname} - ${invoice.input.month}/${invoice.input.year}`
    : "";

/**
 * Returns a presentational name for a draft invoice
 * @param {Object} invoice
 */
export const presentationalDraftInvoiceName = (draft) =>
  draft
    ? `Invoice from ${draft.name} - ${draft.date.month}/${draft.date.year}`
    : "";

/**
 * Returns true if the given invoice wasn't reviewed by an admin yet
 * @param {Object} invoice
 */
export const isUnreviewedInvoice = (invoice) =>
  invoice.status === INVOICE_STATUS_NEW ||
  invoice.status === INVOICE_STATUS_UPDATED;

export const getInvoiceTotalHours = (invoice) => {
  if (!invoice) return 0;
  return invoice.input.lineitems.reduce((total, item) => {
    return (total += item.labor / 60);
  }, 0);
};

export const getInvoiceTotalExpenses = (invoice) => {
  if (!invoice) return 0;
  return invoice.input.lineitems.reduce((total, item) => {
    return (total += item.expenses / 100);
  }, 0);
};

export const getInvoiceTotalAmount = (invoice) => {
  if (!invoice) return 0;
  const totalHours = getInvoiceTotalHours(invoice);
  const totalExpenses = getInvoiceTotalExpenses(invoice);
  const rate = invoice.input.contractorrate / 100;
  return rate * totalHours + totalExpenses;
};
