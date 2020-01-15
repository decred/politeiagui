import React, { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { constants } from "./helpers";

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
  title: PropTypes.string,
  logoLight: PropTypes.string,
  logoDark: PropTypes.string,
  recordType: PropTypes.oneOf([
    constants.RECORD_TYPE_INVOICE,
    constants.RECORD_TYPE_PROPOSAL
  ]),
  aboutContent: PropTypes.string,
  enableAdminInvite: PropTypes.bool,
  enableCommentVote: PropTypes.bool,
  enableCredits: PropTypes.bool,
  enablePaywall: PropTypes.bool,
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
  )
};

export default ConfigProvider;
