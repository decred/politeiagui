import fileDownload from "js-file-download";

export function downloadJSON(data, filename) {
  const dataToString = JSON.stringify(data, null, 2);
  fileDownload(dataToString, `${filename}.json`);
}

export function downloadCSV(data, fields, filename) {
  const titles = `${fields.join(",")}\n`;
  const csvData = data.reduce((acc, info) => {
    const row = Object.values(info).join(",");
    return `${acc}${row}\n`;
  }, titles);
  fileDownload(csvData, `${filename}.csv`);
}
