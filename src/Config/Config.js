import React from "react";
import { ConfigProvider } from "./ConfigProvider";
import dotenvParse from "dotenv-parse-variables";
import * as presets from "./presets";

const defaultPreset = presets.POLITEIA;

/**
 * loadConfig will override any default option with the options specified
 * through the enviroment variables. If a preset name is specified, all
 * other options will be ignored and the preset will be returned instead.
 */
const loadConfig = () => {
  const {
    isStaging: defaultStagingValue,
    title: defaultTitleValue
  } = defaultPreset;
  const env = dotenvParse(process.env);
  const getConf = key => env[`REACT_APP_${key}`];

  const presetName = getConf("PRESET");
  if (presetName) {
    if (!presets[presetName]) {
      throw new Error(
        "Invalid preset. Valid presets name are POLITEIA and CMS."
      );
    }

    return presets[presetName];
  }

  return {
    isStaging: getConf("IS_STAGING") || defaultStagingValue,
    title: getConf("TITLE") || defaultTitleValue
  };
};

/**
 * Config will give preference to load the config options from the preset
 * if any is specified.
 */
const Config = ({ children }) => {
  const configOptions = loadConfig();
  return <ConfigProvider {...configOptions}>{children}</ConfigProvider>;
};

export default Config;
