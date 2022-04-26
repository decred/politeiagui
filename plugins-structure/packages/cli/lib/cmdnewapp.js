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

module.exports = function newApp(appName, { port, plugins, config }) {
  let defaultApp = false;
  if (!appName) {
    console.error("Error: Please specify the app name");
    return;
  }
  if (plugins && typeof plugins !== "string") {
    console.error("Error: Plugins must be a string");
    return;
  }
  if (config && typeof config !== "string") {
    console.error("Error: Config must be a string");
    return;
  }
  if (!plugins && !config) {
    defaultApp = true;
  }

  let configFile;
  if (typeof config === "string" && config) {
    const configExists = fs.existsSync(path.resolve(__dirname, config));
    if (!configExists) {
      console.error("Error: Could not find config file");
      return;
    } else {
      configFile = require(config);
    }
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
  const pluginsDeps = {};
  const pluginsConfig = {};
  if (!defaultApp) {
    let appPlugins;
    if (!config) {
      appPlugins = plugins.split(",");
      for (let plugin of appPlugins) {
        const pluginDepName = `@politeiagui/${plugin}`;
        try {
          const pluginDepVersion = getPluginVersion(plugin);
          pluginsDeps[pluginDepName] = pluginDepVersion;
          pluginsConfig[plugin] = { version: pluginDepVersion };
        } catch (e) {
          console.log(e);
          return;
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

  // create config.json if one is not provided
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
  } else {
    // copy if it is provided
    fs.copyFileSync(config, `${appPath}/config.json`);
  }

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
