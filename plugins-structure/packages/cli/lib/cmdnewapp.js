const fs = require("fs");
const path = require("path");
const os = require("os");

const {
  replaceFileValuesFromMap,
  copyFile,
  getPluginVersion,
} = require("./utils");

const baseAppPackageJSON = require("../app/package.json");
const baseAppPath = path.resolve(__dirname, "../app");

module.exports = function newApp(appName, { port, plugins }) {
  if (!appName) {
    console.error("Please specify the app name");
    return;
  }
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
  const appPlugins = plugins.split(",");
  const pluginsDeps = {};
  const pluginsConfig = {};
  for (let plugin of appPlugins) {
    const pluginDepName = `@politeiagui/${plugin}`;
    try {
      const pluginDepVersion = getPluginVersion(plugin);
      pluginsDeps[pluginDepName] = pluginDepVersion;
      pluginsConfig[plugin] = pluginDepVersion;
    } catch (e) {
      console.log(e);
      return;
    }
  }
  fs.writeFileSync(
    path.join(appPath, "package.json"),
    JSON.stringify(
      {
        name: appName,
        ...baseAppPackageJSON,
        dependencies: {
          "@politeiagui/core": "1.0.0",
          "@politeiagui/common-ui": "1.0.0",
          ...pluginsDeps,
        },
      },
      null,
      2
    ) + +os.EOL
  );
  // create plugins.config.json
  const pluginsConfigJson = {
    ...pluginsConfig,
  };
  fs.writeFileSync(
    path.join(appPath, "plugins.config.json"),
    JSON.stringify(pluginsConfigJson, null, 2) + os.EOL
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
