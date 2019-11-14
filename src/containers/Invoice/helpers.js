import { getCurrentMonth, getCurrentYear } from "src/helpers";

/**
 * Returns the initial month and year to be applied to a blank invoice form
 * @returns {Object} { year, month}
 */
export const getInitialDateValue = () => {
  const currYear = getCurrentYear();
  const currMonth = getCurrentMonth();

  // case is december
  if (currMonth === 1) {
    return {
      year: currYear - 1,
      month: 12
    };
  }

  return {
    year: currYear,
    month: currMonth - 1
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
