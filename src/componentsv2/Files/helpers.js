export function getFormattedFiles(files) {
  const formattedFiles = [];
  files.forEach(r => {
    const [event, file] = r;
    formattedFiles.push({
      name: file.name,
      mime: file.name.includes(".txt")
        ? `${file.type}; charset=utf-8`
        : file.type,
      size: file.size,
      payload: btoa(event.target.result)
    });
  });
  return formattedFiles;
}
