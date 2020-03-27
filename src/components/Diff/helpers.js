const markAsAdded = (elem) => ({
  value: elem.value,
  lineIndex: elem.index,
  removed: false,
  added: true
});

const markAsRemoved = (elem) => ({
  lineIndex: elem.index,
  removed: elem.value,
  added: false
});

const markAsUnchanged = (elem) => ({
  value: elem.value,
  lineIndex: elem.index,
  removed: false,
  added: false
});

export const arrayDiff = (newCommentBody, oldCommentBody, lineDiffFunc) => [
  ...newCommentBody.filter(lineDiffFunc(oldCommentBody)).map(markAsAdded),
  ...oldCommentBody.filter(lineDiffFunc(newCommentBody)).map(markAsRemoved),
  ...newCommentBody.filter(lineEqFunc(oldCommentBody)).map(markAsUnchanged)
];

export const lineDiffFunc = (arr) => (elem) =>
  !arr.some((arrelem) => arrelem.value === elem.value);

export const lineEqFunc = (arr) => (elem) => !lineDiffFunc(arr)(elem);

export const getLineArray = (string) =>
  string && string.length
    ? string.split("\n\n").map((line, index) => ({ value: line, index: index }))
    : [];

const markFileAsAdded = (elem) => ({ ...elem, added: true });
const markFileAsRemoved = (elem) => ({ ...elem, removed: true });

const filesDiffFunc = (arr) => (elem) =>
  !arr.some(
    (arrelem) => arrelem.name === elem.name && arrelem.payload === elem.payload
  );
const filesEqFunc = (arr) => (elem) => !filesDiffFunc(arr)(elem);

export const getFilesDiff = (newFiles, oldFiles) => [
  ...newFiles.filter(filesDiffFunc(oldFiles)).map(markFileAsAdded),
  ...oldFiles.filter(filesDiffFunc(newFiles)).map(markFileAsRemoved),
  ...newFiles.filter(filesEqFunc(oldFiles)) // for unchanged files
];
