const path = require("path");

const {
  createSrcFiles,
  validatePlugins,
  validateAppName,
  validateConfig,
  loadConfigFile,
  createNewApp,
  createPackageJsonFile,
  createConfigFile,
  createWebpackConfigFiles,
  createTestConfigFiles,
  getPluginsDepsAndConfig,
} = require("./utils");

const baseAppPackageJSON = require("../app/package.json");
const baseAppPath = path.resolve(__dirname, "../app");

module.exports = function newApp(appName, { port, plugins, config }) {
  try {
    let configFile;
    const isDefaultApp = !plugins && !config;

    validateAppName(appName);
    validatePlugins(plugins);
    validateConfig(config);
    if (config) configFile = loadConfigFile(config);
    const { pluginsDeps, pluginsConfig } = getPluginsDepsAndConfig({
      isDefaultApp,
      plugins,
      configFile,
    });
    const appPath = createNewApp(appName);
    createPackageJsonFile({
      appName,
      baseAppPackageJSON,
      pluginsDeps,
      appPath,
    });
    createConfigFile({ appPath, config, pluginsConfig });
    createWebpackConfigFiles({ appPath, port, baseAppPath });
    createTestConfigFiles({ appPath, baseAppPath });
    createSrcFiles({ appPath, appName, baseAppPath });
  } catch (e) {
    console.error(e);
    return;
  }
  console.log("Done!");
};
