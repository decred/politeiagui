import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { bool, or } from "../lib/fp";

const getIsApiRequesting = key => bool(get(["external_api", key, "isRequesting"]));
const getApiResponse = key => get(["external_api", key, "response"]);
const getApiError = key => get(["external_api", key, "error"]);

export const isApiRequestingPayWithFaucet = or(
  getIsApiRequesting("payWithFaucet"),
  getIsApiRequesting("blockHeight"),
);

export const payWithFaucetError = getApiError("payWithFaucet");
export const payWithFaucetTxId = compose(get("Txid"), getApiResponse("payWithFaucet"));

export const lastBlockHeight = getApiResponse("blockHeight");
