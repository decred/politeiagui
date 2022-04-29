import fileDownload from "js-file-download";

export function downloadJson(data, fileName = "data") {
  fileDownload(JSON.stringify(data, null, 2), `${fileName}.json`);
}
