import { MONTHS_LABELS } from "./constants";
/**
 * Formats unix seconds timestamp to a UTC string date
 *
 * @param {number} unixtimestamp - unix timestamp
 * @return {string} date - date formated in UTC String
 */
export const formatUnixTimestamp = (unixtimestamp) =>
  new Date(unixtimestamp * 1000).toUTCString();

/**
 * Formats unix seconds timestamp to an { day, month, year} object
 * @param {number} unixtimestamp - unix seconds timestamp
 * @return {object} date - { day, month, year } object
 */
export const formatUnixTimestampToObj = (unixtimestamp) => {
  const date = new Date(unixtimestamp * 1000);
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

/**
 * formatDateToInternationalString accepts an object of day, month and year.
 * It returns a string of human viewable international date from the result
 * of DatePicker or BackEnd and supposes they are correct.
 * String format: 08 Sep 2021
 * @param {object} { day, month, year }
 * @returns {string}
 */
export function formatDateToInternationalString({ day, month, year }) {
  const monthLabel = MONTHS_LABELS[month - 1];
  if (monthLabel === undefined) {
    return "Invalid Date";
  }
  const dayView = `0${day}`.slice(-2);
  return `${dayView} ${MONTHS_LABELS[month - 1]} ${year}`;
}

/**
 * Returns a formatter to format a number to US standard currency string.
 * Example: const f = currencyFormatter("USD"); f.format(2500) // $2,500.00
 * @param {string} currency
 */
export const currencyFormatter = (currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });

/** exports an usdFormatter */
export const usdFormatter = currencyFormatter("USD");
