import get from "lodash/fp/get";
import { bool, or } from "../lib/fp";

const getIsApiRequesting = key => bool(get(["external_api", key, "isRequesting"]));
const getApiResponse = key => get(["external_api", key, "response"]);

export const isApiRequestingPayWithFaucet = or(
  getIsApiRequesting("payWithFaucet"),
  getIsApiRequesting("blockHeight"),
);

export const lastBlockHeight = getApiResponse("blockHeight");
