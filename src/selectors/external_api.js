import get from "lodash/fp/get";
import { bool } from "../lib/fp";

const getIsApiRequesting = key => bool(get(["external_api", key, "isRequesting"]));

export const isApiRequestingPayWithFaucet = getIsApiRequesting("payWithFaucet");
