export const or = (...fns) => (...args) => {
  let result;
  return fns.find(fn => result = fn(...args)) ? result : false;
};
