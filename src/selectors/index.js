export * from "./api";

export const selectorMap = fns => (...args) => Object.keys(fns)
  .reduce((res, key) => ({ ...res, [key]: fns[key](...args) }), {});
