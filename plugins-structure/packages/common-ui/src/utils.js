import { INVALID_DATE_LABEL, MONTHS_LABELS } from "./constants";

/**
 * Converts atoms to DCR
 *
 * @param {number} atoms - amount in atoms
 * @return {number} dcr - amount in dcr
 */
export const convertAtomsToDcr = (atoms) => atoms / 100000000;

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
 * Formats a date object `{ day, month, year }` to seconds timestamp
 * @param {{ day: number, month: number, year: number }} DateObj
 * @returns
 */
export const formatDateObjToTimestamp = ({ day, month, year } = {}) =>
  Math.floor(new Date(year, month - 1, day).getTime() / 1000);

/**
 * Formats unix seconds timestamp to a short UTC string date
 *
 * @param {number} unixtimestamp - unix seconds timestamp
 * @return {string} date - date formated in dd mmm yyyy
 */
export const formatShortUnixTimestamp = (unixtimestamp) => {
  const currentdate = new Date(unixtimestamp * 1000);
  return `${currentdate.getUTCDate()} ${
    MONTHS_LABELS[currentdate.getUTCMonth()]
  } ${currentdate.getUTCFullYear()}`;
};

/**
 * formatDateToInternationalString accepts an object of day, month and year.
 * It returns a string of human viewable international date from the result
 * of DatePicker or BackEnd and supposes they are correct.
 * String format: 08 Sep 2021
 * @param {object} { day, month, year }
 * @returns {string}
 */
export const formatDateToInternationalString = ({ day, month, year }) => {
  const monthLabel = MONTHS_LABELS[month - 1];
  if (monthLabel === undefined) {
    return INVALID_DATE_LABEL;
  }
  const dayView = `0${day}`.slice(-2);
  return `${dayView} ${MONTHS_LABELS[month - 1]} ${year}`;
};

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
