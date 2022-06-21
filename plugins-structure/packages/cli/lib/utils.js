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

function validateAppName(appName) {
  if (!appName) {
    throw Error("Please specify the app name");
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

function getAppPath(appName) {
  const appShellPath = path.resolve(__dirname, "../../../apps/");
  const appPath = path.resolve(appShellPath, appName);
  const appExists = fs.existsSync(appPath);
  if (appExists) {
    throw Error(`App ${appName} already exists on ${appShellPath}`);
  }
  return appPath;
}

function loadConfigFile(config) {
  const configExists = fs.existsSync(path.resolve(__dirname, config));
  if (!configExists) {
    throw Error("Could not find config file");
  } else {
    return require(config);
  }
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

function createPackageJsonFile({
  baseAppPackageJSON,
  appName,
  appPath,
  pluginsDeps,
}) {
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
    ) + os.EOL
  );
}

function createConfigFile({ appPath, config, pluginsConfig }) {
  console.log("Creating config file...");
  console.log("Plugins:");
  if (!config) {
    const configJson = {
      plugins: {
        ...pluginsConfig,
      },
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

function createWebpackConfigFiles({ port, baseAppPath, appPath }) {
  const wpDev = replaceFileValuesFromMap(`${baseAppPath}/webpack.dev.js`, {
    __PORT__: +port,
  });
  fs.writeFileSync(`${appPath}/webpack.dev.js`, wpDev);
  copyFile("webpack.common.js", appPath, baseAppPath);
  copyFile("webpack.prod.js", appPath, baseAppPath);
}

function createTestConfigFiles({ appPath, baseAppPath }) {
  copyFile("jest.config.js", appPath, baseAppPath);
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
    __APP_NAME__: appName,
  });
  const appJs = replaceFileValuesFromMap(`${baseAppPath}/src/app.js`, {
    __APP_NAME__: appName,
    __PLUGINS_IMPORTS__: "\n" + pluginsImports,
    '"__PLUGINS_CONNECTED__"': plugins,
  });
  fs.writeFileSync(`${appPath}/src/public/index.html`, indexHtml);
  fs.writeFileSync(`${appPath}/src/index.js`, indexJs);
  fs.writeFileSync(`${appPath}/src/app.js`, appJs);
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
  validateAppName,
  validatePlugins,
  validateConfig,
  createNewApp,
  loadConfigFile,
  createPackageJsonFile,
  createConfigFile,
  createAppSrcFiles,
  createWebpackConfigFiles,
  createTestConfigFiles,
  getPluginsDepsAndConfig,
};
