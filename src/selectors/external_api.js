import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { bool, or } from "../lib/fp";

export const getIsExtApiRequesting = key =>
  bool(get(["external_api", key, "isRequesting"]));
export const getExtApiResponse = key => get(["external_api", key, "response"]);
export const getExtApiError = key => get(["external_api", key, "error"]);

export const isApiRequestingPayWithFaucet = or(
  getIsExtApiRequesting("payWithFaucet")
);

export const payWithFaucetError = getExtApiError("payWithFaucet");

export const payWithFaucetTxId = compose(
  get("txid"),
  getExtApiResponse("payWithFaucet")
);
