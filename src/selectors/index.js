export * from "./app";
export * from "./api";
export * from "./modal";
export * from "./external_api";
export * from "./form";

export const selectorMap = fns => (...args) =>
  Object.keys(fns).reduce(
    (res, key) => ({ ...res, [key]: fns[key](...args) }),
    {}
  );
