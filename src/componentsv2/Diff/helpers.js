const markAsAdded = elem => ({
  value: elem.value,
  lineIndex: elem.index,
  removed: false,
  added: true
});

const markAsRemoved = elem => ({
  lineIndex: elem.index,
  removed: elem.value,
  added: false
});

const markAsUnchanged = elem => ({
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

export const lineDiffFunc = arr => elem =>
  !arr.some(arrelem => arrelem.value === elem.value);

export const lineEqFunc = arr => elem => !lineDiffFunc(arr)(elem);

export const getLineArray = string =>
  string && string.length
    ? string.split("\n").map((line, index) => ({ value: line, index: index }))
    : [];
