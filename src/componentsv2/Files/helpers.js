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
