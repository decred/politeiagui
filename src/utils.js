const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

/**
 * Converts atoms to DCR
 *
 * @param {number} atoms - amount in atoms
 * @return {number} dcr - amount in dcr
 */
export const convertAtomsToDcr = (atoms) => atoms / 100000000;

/**
 * Converts { day, month, year } object to unix second timestamp
 * uses 23:59 of that day as time.
 * @param {object} date
 */
export const convertObjectToUnixTimestamp = ({ day, month, year }) =>
  new Date(Date.UTC(year, month - 1, day, 23, 59)).getTime() / 1000;

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
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear()
  };
};

/**
 * Formats unix seconds timestamp to a short UTC string date
 *
 * @param {number} unixtimestamp - unix seconds timestamp
 * @return {string} date - date formated in dd mmm yyyy
 */

export const formatShortUnixTimestamp = (unixtimestamp) => {
  const currentdate = new Date(unixtimestamp * 1000);
  return `${currentdate.getUTCDate()} ${
    months[currentdate.getUTCMonth()]
  } ${currentdate.getUTCFullYear()}`;
};

/**
 * Returns a formatter to format a number to US standard currency string. Example: const f = currencyFormatter("USD"); f.format(2500) // $2,500.00
 * @param {string} currency
 */
export const currencyFormatter = (currency) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency
  });

/** exports an usdFormatter */
export const usdFormatter = currencyFormatter("USD");
