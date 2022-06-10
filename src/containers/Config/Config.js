import dotenvParse from "dotenv-parse-variables";
import React, { useState, useEffect } from "react";
import { ConfigProvider } from "./ConfigProvider";
import politeiaConfig from "src/apps/politeia/config.json";
import { mergeAll } from "lodash/fp";
import { getQueryStringValue } from "src/lib/queryString";
import usePolicy from "src/hooks/api/usePolicy";

const env = dotenvParse(process.env);
const getEnvVariable = (key) => env[`REACT_APP_${key}`];

const defaultPreset = politeiaConfig;

/**
 * runtimeConfig returns config set at runtime.
 */
const runtimeConfig = {
  /**
   * javascriptEnabled indicates if the server detected a client with
   * disabled javascript rendering via rendertron.
   */

  javascriptEnabled: !getQueryStringValue("nojavascript")
};

/**
 * loadConfig will try to import the config.json from 'src/apps/<preset_name'
 * if the preset name is not provided, it will return the default config.
 */
const loadConfig = async () => {
  const presetName = getEnvVariable("PRESET");
  if (!presetName) return mergeAll([defaultPreset, runtimeConfig]);

  const configModule = await import(`src/apps/${presetName}/config.json`);

  return mergeAll([configModule.default, runtimeConfig]);
};

/**
 * Config will give preference to load the config options from the preset
 * if any is specified.
 */
const Config = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [configOptions, setConfig] = useState(null);
  const { policy } = usePolicy();

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
    <ConfigProvider
      {...{
        ...configOptions,
        enablePaywall: !!policy?.paywallenabled,
        enableCredits: !!policy?.paywallenabled
      }}
    >
      {!loading && !error && configOptions && children}
      {error}
    </ConfigProvider>
  );
};

export default Config;
