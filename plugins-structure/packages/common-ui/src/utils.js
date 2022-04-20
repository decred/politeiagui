import { INVALID_DATE_LABEL, MONTHS_LABELS } from "./constants";

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
export const formatDateToInternationalString = ({ day, month, year }) => {
  const monthLabel = MONTHS_LABELS[month - 1];
  if (monthLabel === undefined) {
    return INVALID_DATE_LABEL;
  }
  const dayView = `0${day}`.slice(-2);
  return `${dayView} ${MONTHS_LABELS[month - 1]} ${year}`;
};
