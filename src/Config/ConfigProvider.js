import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { constants } from "./presets";

export const ConfigContext = createContext();

export const ConfigConsumer = ConfigContext.Consumer;

export const useConfig = () => useContext(ConfigContext);

/**
 * This wrap around the config provider is needed to add props validation for
 * each custom option alllowed.
 */
export const ConfigProvider = ({ children, ...configOptions }) => (
  <ConfigContext.Provider value={{ ...configOptions, constants }}>
    {children}
  </ConfigContext.Provider>
);

ConfigProvider.propTypes = {
  isStaging: PropTypes.bool,
  title: PropTypes.string,
  recordType: PropTypes.oneOf([
    constants.RECORD_TYPE_INVOICE,
    constants.RECORD_TYPE_PROPOSAL
  ]),
  enableAdminInvite: PropTypes.bool
};

export default ConfigProvider;
