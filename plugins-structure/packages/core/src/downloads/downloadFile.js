import fileDownload from "js-file-download";

function addFilenameDate(filename) {
  const date = new Date();
  return `${date.getUTCFullYear()}${
    date.getUTCMonth() + 1
  }${date.getUTCDate()}-${filename}`;
}

export function downloadJSON(data, filename, { datePrefix = false } = {}) {
  const dataToString = JSON.stringify(data, null, 2);
  if (datePrefix) {
    filename = addFilenameDate(filename);
  }
  fileDownload(dataToString, `${filename}.json`);
}

export function downloadCSV(
  data,
  fields,
  filename,
  { datePrefix = false } = {}
) {
  const titles = `${fields.join(",")}\n`;
  const csvData = data.reduce((acc, info) => {
    const row = Object.values(info).join(",");
    return `${acc}${row}\n`;
  }, titles);
  if (datePrefix) {
    filename = addFilenameDate(filename);
  }
  fileDownload(csvData, `${filename}.csv`);
}
