const path = require("path");
const fs = require("fs");

const {
  replaceFileValuesFromMap,
  validatePlugins,
  validateName,
  validateConfig,
  loadConfigFile,
  createPackageJsonFile,
  createConfigFile,
  getPluginsDepsAndConfig,
  getPluginNameFromDep
} = require("./utils");

function getAppPath(appName) {
  const appShellPath = path.resolve(__dirname, "../../../apps/");
  const appPath = path.resolve(appShellPath, appName);
  const appExists = fs.existsSync(appPath);
  if (appExists) {
    throw Error(`App ${appName} already exists on ${appShellPath}`);
  }
  return appPath;
}

function createNewApp(appName) {
  let appPath;
  try {
    appPath = getAppPath(appName);
    console.log(`Creating a new app: ${appName}`);
    console.log(`Directory: ${appPath}`);
    console.log(`\n\n`);
    console.log("Creating app files...");

    // create app dir
    fs.mkdirSync(appPath);
    fs.mkdirSync(`${appPath}/src`);
    fs.mkdirSync(`${appPath}/src/public`);
  } catch (e) {
    throw e;
  }
  return appPath;
}

function createAppSrcFiles({ baseAppPath, appName, appPath, pluginsDeps }) {
  const plugins = Object.keys(pluginsDeps).map(getPluginNameFromDep).join(", ");
  const pluginsImports = Object.keys(pluginsDeps)
    .map((dep) => `import ${getPluginNameFromDep(dep)} from "${dep}";`)
    .join("\n");
  const indexHtml = replaceFileValuesFromMap(
    `${baseAppPath}/src/public/index.html`,
    { __APP_NAME__: appName }
  );
  const indexJs = replaceFileValuesFromMap(`${baseAppPath}/src/index.js`, {
    __APP_NAME__: appName
  });
  const appJs = replaceFileValuesFromMap(`${baseAppPath}/src/app.js`, {
    __APP_NAME__: appName,
    __PLUGINS_IMPORTS__: "\n" + pluginsImports,
    '"__PLUGINS_CONNECTED__"': plugins
  });
  fs.writeFileSync(`${appPath}/src/public/index.html`, indexHtml);
  fs.writeFileSync(`${appPath}/src/index.js`, indexJs);
  fs.writeFileSync(`${appPath}/src/app.js`, appJs);
}

const baseAppPackageJSON = require("../app/package.json");
const baseAppPath = path.resolve(__dirname, "../app");

module.exports = function newApp(appName, { plugins, config }) {
  try {
    let configFile;
    const isDefaultApp = !plugins && !config;

    validateName(appName);
    validatePlugins(plugins);
    validateConfig(config);
    if (config) configFile = loadConfigFile(config);
    const { pluginsDeps, pluginsConfig } = getPluginsDepsAndConfig({
      isDefaultApp,
      plugins,
      configFile
    });
    const appPath = createNewApp(appName);
    createPackageJsonFile({
      name: appName,
      basePackageJSON: baseAppPackageJSON,
      pluginsDeps,
      targetPath: appPath
    });
    createConfigFile({ appPath, config, pluginsConfig });
    createAppSrcFiles({ appPath, appName, baseAppPath, pluginsDeps });
  } catch (e) {
    console.error(e);
    return;
  }
  console.log("Done!");
};
