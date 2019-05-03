import React from "react";
import PropTypes from "prop-types";

export const defaultConfig = {
  isStaging: false,
  title: "Politeia"
};

export const ConfigContext = React.createContext(defaultConfig);

export const ConfigConsumer = ConfigContext.Consumer;

export const useConfig = () => React.useContext(ConfigContext);

/**
 * This wrap around the config provider is needed to add props validation for
 * each custom option alllowed.
 */
export const ConfigProvider = ({ children, ...configOptions }) => (
  <ConfigContext.Provider value={configOptions}>
    {children}
  </ConfigContext.Provider>
);

ConfigProvider.propTypes = {
  isStaging: PropTypes.bool,
  title: PropTypes.string
};

export default ConfigProvider;
