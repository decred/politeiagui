const fs = require("fs");
const path = require("path");

const { replaceFileValuesFromMap, copyFile } = require("./utils");

const basePluginPackageJSON = require("../plugin/package.json");
const basePluginPath = path.resolve(__dirname, "../plugin");

module.exports = function newPlugin(pluginName, { port }) {
  if (!pluginName) {
    console.error("Please specify the app name");
    return;
  }
  const packagePath = path.resolve(__dirname, "../../../packages/");
  const pluginPath = path.resolve(packagePath, pluginName);
  const pluginExists = fs.existsSync(pluginPath);
  if (pluginExists) {
    console.error(
      `Error: Plugin ${pluginName} already exists on ${packagePath}`
    );
    return;
  }

  console.log(`Creating a new plugin: ${pluginName}`);
  console.log(`Directory: ${pluginPath}`);
  console.log(`\n\n`);
  console.log("Creating plugin files...");

  // create plugin dir
  fs.mkdirSync(pluginPath);
  fs.mkdirSync(`${pluginPath}/src`);
  fs.mkdirSync(`${pluginPath}/src/dev`);

  // create plugin package.json
  fs.writeFileSync(
    `${pluginPath}/package.json`,
    JSON.stringify(
      {
        name: `@politeiagui/${pluginName}`,
        ...basePluginPackageJSON,
      },
      null,
      2
    )
  );

  const wpDev = replaceFileValuesFromMap(`${basePluginPath}/webpack.dev.js`, {
    __PORT__: +port,
  });

  // create webpack config files
  fs.writeFileSync(`${pluginPath}/webpack.dev.js`, wpDev);
  copyFile("webpack.common.js", pluginPath, basePluginPath);
  copyFile("webpack.prod.js", pluginPath, basePluginPath);
  // create test config files
  copyFile("jest.config.js", pluginPath, basePluginPath);
  // create src files
  const indexDevHtml = replaceFileValuesFromMap(
    `${basePluginPath}/src/dev/index.html`,
    { __PLUGIN_NAME__: pluginName }
  );
  const indexDevJs = replaceFileValuesFromMap(
    `${basePluginPath}/src/dev/index.js`,
    {
      __PLUGIN_NAME__: pluginName,
    }
  );
  const indexJs = replaceFileValuesFromMap(`${basePluginPath}/src/index.js`, {
    __PLUGIN_NAME__: pluginName,
  });
  fs.writeFileSync(`${pluginPath}/src/dev/index.html`, indexDevHtml);
  fs.writeFileSync(`${pluginPath}/src/dev/index.js`, indexDevJs);
  fs.writeFileSync(`${pluginPath}/src/index.js`, indexJs);

  console.log("Done!");
};
