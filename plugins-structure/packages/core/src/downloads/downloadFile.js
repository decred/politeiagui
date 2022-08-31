import fileDownload from "js-file-download";

export function downloadJSON(data, filename) {
  const dataToString = JSON.stringify(data, null, 2);
  fileDownload(dataToString, `${filename}.json`);
}
