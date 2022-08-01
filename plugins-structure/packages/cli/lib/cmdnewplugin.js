const fs = require("fs");
const path = require("path");

const {
  replaceFileValuesFromMap,
  validateName,
  createPackageJsonFile,
  createBabelConfigFiles,
  createTestConfigFiles
} = require("./utils");

function getPluginPath(pluginName) {
  const packagePath = path.resolve(__dirname, "../../../packages/");
  const pluginPath = path.resolve(packagePath, pluginName);
  const pluginExists = fs.existsSync(pluginPath);
  if (pluginExists) {
    throw Error(`Plugin ${pluginName} already exists on ${packagePath}`);
  }
  return pluginPath;
}

function createNewPlugin(pluginName) {
  let pluginPath;
  try {
    pluginPath = getPluginPath(pluginName);
    console.log("eieie", pluginPath);
    console.log(`Directory: ${pluginPath}`);
    console.log(`\n\n`);
    console.log("Creating plugin files...");

    // create plugin dir
    fs.mkdirSync(pluginPath);
    fs.mkdirSync(`${pluginPath}/src`);
    fs.mkdirSync(`${pluginPath}/src/dev`);
  } catch (e) {
    throw e;
  }
  return pluginPath;
}

function createPluginSrcFile({ basePluginPath, pluginName, pluginPath }) {
  const indexDevHtml = replaceFileValuesFromMap(
    `${basePluginPath}/src/dev/index.html`,
    { __PLUGIN_NAME__: pluginName }
  );
  const indexDevJs = replaceFileValuesFromMap(
    `${basePluginPath}/src/dev/index.js`,
    {
      __PLUGIN_NAME__: pluginName
    }
  );
  const indexJs = replaceFileValuesFromMap(`${basePluginPath}/src/index.js`, {
    __PLUGIN_NAME__: pluginName
  });
  fs.writeFileSync(`${pluginPath}/src/dev/index.html`, indexDevHtml);
  fs.writeFileSync(`${pluginPath}/src/dev/index.js`, indexDevJs);
  fs.writeFileSync(`${pluginPath}/src/index.js`, indexJs);
}

const basePluginPackageJSON = require("../plugin/package.json");
const basePluginPath = path.resolve(__dirname, "../plugin");

module.exports = function newPlugin(pluginName) {
  try {
    validateName(pluginName);
    const pluginPath = createNewPlugin(pluginName);
    createPackageJsonFile({
      name: pluginName,
      basePackageJSON: basePluginPackageJSON,
      targetPath: pluginPath
    });
    createBabelConfigFiles({ path: pluginPath, basePath: basePluginPath });
    createTestConfigFiles({ path: pluginPath, basePath: basePluginPath });
    createPluginSrcFile({ pluginPath, basePluginPath, pluginName });
  } catch (e) {
    console.error(e);
    return;
  }
  console.log("Done!");
};
