export const arg =
  (idx) =>
  (...args) =>
    args[idx];
export const constant = (x) => () => x;
export const not =
  (fn) =>
  (...args) =>
    !fn(...args);
export const bool =
  (fn) =>
  (...args) =>
    !!fn(...args);
export const or =
  (...fns) =>
  (...args) => {
    let result;
    return fns.find((fn) => (result = fn(...args))) ? result : false;
  };
export const and =
  (...fns) =>
  (...args) => {
    let result;
    return fns.find((fn) => {
      result = fn(...args);
      return !result;
    })
      ? false
      : result;
  };
