import React, { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { constants } from "./helpers";
import usePolicy from "src/hooks/api/usePolicy";

export const ConfigContext = createContext();

const CustomConfigContext = createContext();

export const ConfigConsumer = ConfigContext.Consumer;

// Overwrite app config enablePaywall with the option sent from the server
const injectBackendPaywall = (obj) => (paywallOption) => ({
  ...obj,
  enablePaywall: paywallOption
});

export const useConfig = () => {
  const defaultConfig = useContext(ConfigContext);
  const customConfig = useContext(CustomConfigContext);
  const {
    policy: { paywallenabled }
  } = usePolicy();

  const config = useMemo(
    () =>
      customConfig
        ? {
            ...defaultConfig,
            ...customConfig
          }
        : defaultConfig,
    [customConfig, defaultConfig]
  );

  return injectBackendPaywall(config)(paywallenabled);
};

/**
 * This wrap around the config provider is needed to add props validation for
 * each custom option alllowed.
 */
export const ConfigProvider = ({ children, ...configOptions }) => (
  <ConfigContext.Provider value={{ ...configOptions, constants }}>
    {children}
  </ConfigContext.Provider>
);

/**
 * This wrap around the custom config provider is needed to add props validation for
 * each custom option alllowed.
 */
export const CustomConfigProvider = ({ children, ...customConfigOptions }) => (
  <CustomConfigContext.Provider value={{ ...customConfigOptions }}>
    {children}
  </CustomConfigContext.Provider>
);

ConfigProvider.propTypes = {
  title: PropTypes.string,
  logoLight: PropTypes.string,
  logoDark: PropTypes.string,
  recordType: PropTypes.oneOf([
    constants.RECORD_TYPE_INVOICE,
    constants.RECORD_TYPE_PROPOSAL,
    constants.RECORD_TYPE_DCC
  ]),
  aboutContent: PropTypes.string,
  enableAdminInvite: PropTypes.bool,
  enableCommentVote: PropTypes.bool,
  enableCredits: PropTypes.bool,
  onBoardContent: PropTypes.string,
  onBoardLink: PropTypes.string,
  privacyPolicyContent: PropTypes.string,
  testnetGitRepository: PropTypes.string,
  mainnetGitRepository: PropTypes.string,
  navMenuPaths: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      path: PropTypes.string,
      admin: PropTypes.bool
    })
  ),
  javascriptEnabled: PropTypes.bool
};

CustomConfigProvider.propTypes = {
  recordType: PropTypes.oneOf([
    constants.RECORD_TYPE_INVOICE,
    constants.RECORD_TYPE_PROPOSAL,
    constants.RECORD_TYPE_DCC
  ])
};

export default ConfigProvider;
