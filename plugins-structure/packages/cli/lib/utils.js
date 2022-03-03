const fs = require("fs");

function replaceFileValuesFromMap(filePath, replaceMap) {
  const fileString = fs.readFileSync(filePath)?.toString();
  let newFile;
  for (const key in replaceMap) {
    newFile = fileString.replace(new RegExp(key, "g"), replaceMap[key]);
  }
  return newFile;
}

function copyFile(filename, targetPath, basePath) {
  fs.copyFileSync(`${basePath}/${filename}`, `${targetPath}/${filename}`);
}

module.exports = {
  replaceFileValuesFromMap,
  copyFile,
};
