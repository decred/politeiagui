import dotenvParse from "dotenv-parse-variables";
import React, { useState, useEffect } from "react";
import { ConfigProvider } from "./ConfigProvider";
import politeiaConfig from "src/apps/politeia/config.json";

const env = dotenvParse(process.env);
const getEnvVariable = key => env[`REACT_APP_${key}`];

const defaultPreset = politeiaConfig;

/**
 * loadConfig will try to import the config.json from 'src/apps/<preset_name'
 * if the preset name is not provided, it will return the default config.
 */
const loadConfig = async () => {
  const presetName = getEnvVariable("PRESET");
  if (!presetName) return defaultPreset;

  const configModule = await import(`src/apps/${presetName}/config.json`);
  return configModule.default;
};

/**
 * Config will give preference to load the config options from the preset
 * if any is specified.
 */
const Config = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [configOptions, setConfig] = useState(null);
  useEffect(() => {
    async function initConfig() {
      try {
        setLoading(true);
        const cfg = await loadConfig();
        setLoading(false);
        setConfig(cfg);
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    }
    initConfig();
  }, []);

  return (
    <ConfigProvider {...{ ...configOptions }}>
      {!loading && !error && configOptions && children}
      {error}
    </ConfigProvider>
  );
};

export default Config;
