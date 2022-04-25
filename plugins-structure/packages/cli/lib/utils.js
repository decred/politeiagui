const fs = require("fs");
const path = require("path");

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

function getPluginVersion(plugin) {
  const pluginDepPath = path.resolve(__dirname, `../../../packages/${plugin}`);
  if (!fs.existsSync(pluginDepPath)) {
    throw Error(
      `The plugin ${plugin} doesn't exist in the packages folder. Do you have a typo?`
    );
  }

  const pluginPkgPath = path.join(pluginDepPath, "package.json");

  if (!fs.existsSync(pluginPkgPath)) {
    throw Error(
      `The plugin ${plugin} doesn't have a package.json. It must have a valid package.json`
    );
  }

  const pluginPkg = require(pluginPkgPath);
  return pluginPkg.version;
}

module.exports = {
  replaceFileValuesFromMap,
  copyFile,
  getPluginVersion,
};
