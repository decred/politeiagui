import React from "react";
import PropTypes from "prop-types";
import { ConfigProvider } from "./ConfigProvider";
import dotenvParse from "dotenv-parse-variables";
import * as presets from "./presets";

const defaultPreset = presets.POLITEIA;

/**
 * loadConfig will override any default option with the options specified
 * through the enviroment variables
 */
const loadConfig = () => {
  const {
    isStaging: defaultStagingValue,
    title: defaultTitleValue
  } = defaultPreset;
  const env = dotenvParse(process.env);
  const getConf = key => env[`REACT_APP_${key}`];

  return {
    isStaging: getConf("IS_STAGING") || defaultStagingValue,
    title: getConf("TITLE") || defaultTitleValue
  };
};

/**
 * Config will give preference to load the config options from the preset
 * if any is specified.
 */
const Config = ({ children, presetName }) => {
  const configOptions = (presetName && presets[presetName]) || loadConfig();
  return <ConfigProvider {...configOptions}>{children}</ConfigProvider>;
};

Config.propTypes = {
  usePreset: PropTypes.oneOf(["POLITEIA", "CMS"])
};

export default Config;
