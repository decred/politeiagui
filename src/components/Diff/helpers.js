import isEqual from "lodash/fp/isEqual";

const markLineAsAdded = (elem) => ({
  value: elem.value,
  lineIndex: elem.index,
  removed: false,
  added: true
});

const markLineAsRemoved = (elem) => ({
  lineIndex: elem.index,
  removed: elem.value,
  added: false
});

const markLineAsUnchanged = (elem) => ({
  value: elem.value,
  lineIndex: elem.index,
  removed: false,
  added: false
});

export const arrayDiff = (newCommentBody, oldCommentBody, lineDiffFunc) => [
  ...newCommentBody.filter(lineDiffFunc(oldCommentBody)).map(markLineAsAdded),
  ...oldCommentBody.filter(lineDiffFunc(newCommentBody)).map(markLineAsRemoved),
  ...newCommentBody.filter(lineEqFunc(oldCommentBody)).map(markLineAsUnchanged)
];

export const lineDiffFunc = (arr) => (elem) =>
  !arr.some((arrelem) => arrelem.value === elem.value);

export const lineEqFunc = (arr) => (elem) => !lineDiffFunc(arr)(elem);

export const getLineArray = (string) =>
  string && string.length
    ? string.split("\n\n").map((line, index) => ({ value: line, index: index }))
    : [];

const markAsAdded = (elem) => ({ ...elem, added: true });
const markAsRemoved = (elem) => ({ ...elem, removed: true });

const filesDiffFunc = (arr) => (elem) =>
  !arr.some(
    (arrelem) => arrelem.name === elem.name && arrelem.payload === elem.payload
  );
const filesEqFunc = (arr) => (elem) => !filesDiffFunc(arr)(elem);

export const getFilesDiff = (newFiles, oldFiles) => [
  ...newFiles.filter(filesDiffFunc(oldFiles)).map(markAsAdded),
  ...oldFiles.filter(filesDiffFunc(newFiles)).map(markAsRemoved),
  ...newFiles.filter(filesEqFunc(oldFiles)) // for unchanged files
];

const itemsDiffFunc = (arr) => (elem) => !arr.some(isEqual(elem));
const itemsEqFunc = (arr) => (elem) => !itemsDiffFunc(arr)(elem);

export const getLineitemsDiff = (newItems = [], oldItems = []) =>
  [
    ...newItems.filter(itemsDiffFunc(oldItems)).map(markAsAdded),
    ...oldItems.filter(itemsDiffFunc(newItems)).map(markAsRemoved),
    ...newItems.filter(itemsEqFunc(oldItems))
  ].sort((a, b) => a.index - b.index);

export const setLineitemParams = (lineItems = [], params = {}) =>
  lineItems.map((line, index) => ({ ...params, ...line, index }));
