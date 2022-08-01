const fs = require("fs");
const path = require("path");
const os = require("os");

function replaceFileValuesFromMap(filePath, replaceMap) {
  let newFile = fs.readFileSync(filePath)?.toString();
  for (const key in replaceMap) {
    newFile = newFile.replace(new RegExp(key, "g"), replaceMap[key]);
  }
  return newFile;
}

function getPluginNameFromDep(pluginDep) {
  return pluginDep.replace("@politeiagui/", "");
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

function validateName(name) {
  if (!name) {
    throw Error("Please provide a name");
  }
}
function validatePlugins(plugins) {
  if (plugins && typeof plugins !== "string") {
    throw Error("Plugins must be a string");
  }
}
function validateConfig(config) {
  if (config && typeof config !== "string") {
    throw Error("Config must be a string");
  }
}

function loadConfigFile(config) {
  const configExists = fs.existsSync(path.resolve(__dirname, config));
  if (!configExists) {
    throw Error("Could not find config file");
  } else {
    return require(config);
  }
}

function createPackageJsonFile({
  basePackageJSON,
  name,
  targetPath,
  pluginsDeps
}) {
  fs.writeFileSync(
    path.join(targetPath, "package.json"),
    JSON.stringify(
      {
        name,
        ...basePackageJSON,
        dependencies: pluginsDeps
          ? {
              "@politeiagui/core": "1.0.0",
              "@politeiagui/common-ui": "1.0.0",
              ...pluginsDeps
            }
          : {}
      },
      null,
      2
    ) + os.EOL
  );
}

function createConfigFile({ appPath, config, pluginsConfig }) {
  console.log("Creating config file...");
  console.log("Plugins:");
  if (!config) {
    const configJson = {
      plugins: {
        ...pluginsConfig
      }
    };
    fs.writeFileSync(
      path.join(appPath, "config.json"),
      JSON.stringify(configJson, null, 2) + os.EOL
    );
    console.log(JSON.stringify(pluginsConfig, null, 2));
  } else {
    // copy if it is provided
    const cfg = require(config);
    console.log(JSON.stringify(cfg.plugins, null, 2));
    fs.copyFileSync(config, `${appPath}/config.json`);
  }
}

function createTestConfigFiles({ path, basePath }) {
  copyFile("jest.config.js", path, basePath);
}

function createBabelConfigFiles({ path, basePath }) {
  copyFile("babel.config.js", path, basePath);
}

function getPluginsDepsAndConfig({ isDefaultApp, plugins, configFile }) {
  const pluginsDeps = {};
  const pluginsConfig = {};
  if (!isDefaultApp) {
    let appPlugins;
    if (!configFile) {
      appPlugins = plugins.split(",");
      for (let plugin of appPlugins) {
        const trimmedPlugin = plugin.trim();
        const pluginDepName = `@politeiagui/${trimmedPlugin}`;
        try {
          const pluginDepVersion = getPluginVersion(trimmedPlugin);
          pluginsDeps[pluginDepName] = pluginDepVersion;
          pluginsConfig[trimmedPlugin] = { version: pluginDepVersion };
        } catch (e) {
          throw e;
        }
      }
    } else {
      appPlugins = configFile.plugins;
      for (let plugin in appPlugins) {
        const pluginDepName = `@politeiagui/${plugin}`;
        pluginsDeps[pluginDepName] = appPlugins[plugin].version;
      }
    }
  }
  return { pluginsDeps, pluginsConfig };
}

module.exports = {
  replaceFileValuesFromMap,
  copyFile,
  getPluginVersion,
  validateName,
  validatePlugins,
  validateConfig,
  loadConfigFile,
  createPackageJsonFile,
  createConfigFile,
  createBabelConfigFiles,
  createTestConfigFiles,
  getPluginsDepsAndConfig,
  getPluginNameFromDep
};
