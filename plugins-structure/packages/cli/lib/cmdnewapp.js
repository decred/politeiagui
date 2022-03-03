const fs = require("fs");
const path = require("path");

const { replaceFileValuesFromMap, copyFile } = require("./utils");

const baseAppPackageJSON = require("../app/package.json");
const baseAppPath = path.resolve(__dirname, "../app");

module.exports = function newApp(appName, { port }) {
  const appShellPath = path.resolve(__dirname, "../../../apps/");
  const appPath = path.resolve(appShellPath, appName);
  const appExists = fs.existsSync(appPath);
  if (appExists) {
    console.error(`Error: App ${appName} already exists on ${appShellPath}`);
    return;
  }

  console.log(`Creating a new app: ${appName}`);
  console.log(`Directory: ${appPath}`);
  console.log(`\n\n`);
  console.log("Creating app files...");

  // create app dir
  fs.mkdirSync(appPath);
  fs.mkdirSync(`${appPath}/src`);
  fs.mkdirSync(`${appPath}/src/public`);

  // create app package.json
  fs.writeFileSync(
    `${appPath}/package.json`,
    JSON.stringify(
      {
        name: appName,
        ...baseAppPackageJSON,
      },
      null,
      2
    )
  );
  // create webpack config files
  const wpDev = replaceFileValuesFromMap(`${baseAppPath}/webpack.dev.js`, {
    __PORT__: +port,
  });
  fs.writeFileSync(`${appPath}/webpack.dev.js`, wpDev);
  copyFile("webpack.common.js", appPath, baseAppPath);
  copyFile("webpack.prod.js", appPath, baseAppPath);
  // create test config files
  copyFile("jest.config.js", appPath, baseAppPath);

  // create src files
  const indexHtml = replaceFileValuesFromMap(
    `${baseAppPath}/src/public/index.html`,
    { __APP_NAME__: appName }
  );
  const indexJs = replaceFileValuesFromMap(`${baseAppPath}/src/index.js`, {
    __APP_NAME__: appName,
  });
  fs.writeFileSync(`${appPath}/src/public/index.html`, indexHtml);
  fs.writeFileSync(`${appPath}/src/index.js`, indexJs);

  console.log("Done!");
};
