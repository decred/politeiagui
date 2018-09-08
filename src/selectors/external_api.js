import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { bool, or } from "../lib/fp";

export const getIsApiRequesting = key => bool(get([ "external_api", key, "isRequesting" ]));
export const getApiResponse = key => get([ "external_api", key, "response" ]);
export const getApiError = key => get([ "external_api", key, "error" ]);

export const isApiRequestingPayWithFaucet = or(
  getIsApiRequesting("payWithFaucet"),
  getIsApiRequesting("blockHeight"),
);

export const payWithFaucetError = getApiError("payWithFaucet");
export const payWithFaucetTxId = compose(get("Txid"), getApiResponse("payWithFaucet"));

export const isApiRequestingPayProposalWithFaucet = getIsApiRequesting("payProposalWithFaucet");
export const payProposalWithFaucetError = getApiError("payProposalWithFaucet");
export const payProposalWithFaucetTxId = compose(get("Txid"), getApiResponse("payProposalWithFaucet"));

export const lastBlockHeight = getApiResponse("blockHeight");
