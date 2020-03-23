export * from "./app";
export * from "./api";
export * from "./external_api";
export * from "./models/comments";
export * from "./models/credits";
export * from "./models/users";
export * from "./models/proposals";
export * from "./models/proposalVotes";
export * from "./models/invoices";
export * from "./models/dccs";
export * from "./models/paywall";

export const selectorMap = (fns) => (...args) =>
  Object.keys(fns).reduce(
    (res, key) => ({ ...res, [key]: fns[key](...args) }),
    {}
  );
