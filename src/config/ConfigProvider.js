import React, { useMemo, createContext, useContext } from "react";
import PropTypes from "prop-types";

export const defaultConfig = {
  isStaging: false,
  title: "Politeia"
};

export const ConfigContext = createContext(defaultConfig);

export const ConfigConsumer = ConfigContext.Consumer;

export const useConfig = () => useContext(ConfigContext);

/**
 * This wrap around the config provider is needed to add props validation for
 * each custom option alllowed.
 */
export const ConfigProvider = ({ children, ...configOptions }) => (
  <ConfigContext.Provider
    value={useMemo(() => configOptions, Object.values(configOptions))}
  >
    {children}
  </ConfigContext.Provider>
);

ConfigProvider.propTypes = {
  isStaging: PropTypes.bool,
  title: PropTypes.string
};

export default ConfigProvider;
