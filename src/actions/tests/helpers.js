export const done = (...args) => {
  console.log("HEY", args);
  expect(args[0]).toEqual(undefined);
};

export const doneWithError = (...args) => {
  console.log("HEY", args);
  expect(args[0]).toBeTruthy();
};
