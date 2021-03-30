import * as Yup from "yup";
import { minAmountMessage, maxAmountMessage } from "src/utils/validation";

const MAINNET_MIN_QUORUM_PERCENTAGE = 20;
const MAINNET_MIN_PASS_PERCENTAGE = 60;
const TESTNET_MIN_QUORUM_PERCENTAGE = 0;
const TESTNET_MIN_PASS_PERCENTAGE = 0;
const MAX_QUORUM_PERCENTAGE = 100;
const MAX_PASS_PERCENTAGE = 100;

const getMinQuorumPercentage = (isTestnet) =>
  isTestnet ? TESTNET_MIN_QUORUM_PERCENTAGE : MAINNET_MIN_QUORUM_PERCENTAGE;

const getMinPassPercentage = (isTestnet) =>
  isTestnet ? TESTNET_MIN_PASS_PERCENTAGE : MAINNET_MIN_PASS_PERCENTAGE;

export const validationSchema = (isTestnet) =>
  Yup.object().shape({
    quorumPercentage: Yup.number()
      .required("required")
      .min(
        getMinQuorumPercentage(isTestnet),
        minAmountMessage("quorum percentage", getMinQuorumPercentage(isTestnet))
      )
      .max(
        MAX_QUORUM_PERCENTAGE,
        maxAmountMessage("quorum percentage", MAX_QUORUM_PERCENTAGE)
      ),
    passPercentage: Yup.number()
      .required("required")
      .min(
        getMinPassPercentage(isTestnet),
        minAmountMessage("pass percentage", getMinPassPercentage(isTestnet))
      )
      .max(
        MAX_PASS_PERCENTAGE,
        maxAmountMessage("pass percentage", MAX_PASS_PERCENTAGE)
      )
  });
