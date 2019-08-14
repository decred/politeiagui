export function getFormattedFiles({ base64, fileList }) {
  return Array.from(fileList).map(({ name, size, type: mime }, idx) => {
    return {
      name,
      mime: name.includes(".txt") ? `${mime}; charset=utf-8` : mime,
      size,
      payload: base64[idx].split("base64,").pop()
    };
  });
}

// This function is used to control what files will be included in the UI
// according to pi policies and UX interactions.
export function getValidatedFiles(files, { maximages }) {
  let error = null;

  if (files.length > maximages) {
    files = files
      .reverse()
      .slice(0, [maximages])
      .reverse();
    error = `Proposals can have at most ${maximages} attached images`;
  }

  return { validatedFiles: files, filesLengthLimitError: error };
}
