import dotenvParse from "dotenv-parse-variables";
import React from "react";
import { ConfigProvider } from "./ConfigProvider";
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
    title: defaultTitleValue,
    logoAsset: defaultLogoAsset,
    recordType: defaultRecordType,
    enableAdminInvite: defaultEnableAdminInvite,
    enableCommentVote: defaultEnableCommentVote,
    enableCredits: defaultEnableCredits,
    enablePaywall: defaultEnablePaywall,
    privacyPolicyContent: defaultprivacyPolicyContent,
    aboutContent: defaultAboutContent,
    paywallContent: defaultPaywallContent,
    testnetGitRepository: defaultTestnetGitRepository,
    mainnetGitRepository: defaultMainnetGitRepository,
    navMenuPaths
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
    title: getConf("TITLE") || defaultTitleValue,
    logoAsset: getConf("LOGO_ASSET") || defaultLogoAsset,
    recordType: getConf("RECORD_TYPE") || defaultRecordType,
    enableAdminInvite:
      getConf("ENABLE_ADMIN_INVITE") || defaultEnableAdminInvite,
    enableCommentVote:
      getConf("ENABLE_COMMENT_VOTE") || defaultEnableCommentVote,
    enableCredits: getConf("ENABLE_CREDITS") || defaultEnableCredits,
    enablePaywall: getConf("ENABLE_PAYWALL") || defaultEnablePaywall,
    privacyPolicyContent:
      getConf("PRIVACY_POLICY_CONTENT") || defaultprivacyPolicyContent,
    aboutContent: getConf("ABOUT_CONTENT") || defaultAboutContent,
    paywallContent: getConf("PAYWALL_CONTENT") || defaultPaywallContent,
    testnetGitRepository:
      getConf("TESTNET_GIT_REPOSITORY") || defaultTestnetGitRepository,
    mainnetGitRepository:
      getConf("MAINNET_GIT_REPOSITORY") || defaultMainnetGitRepository,
    navMenuPaths
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
