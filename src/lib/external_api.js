import { NETWORK } from "../constants";

const dcrdataURL = (network) => `https://${network}.dcrdata.org/api`;
const insightURL = (network) => `https://${network}.decred.org/api`;

const dcrddataBlockHeightURL = network => `${dcrdataURL(network)}/block/best/height`;
const insightBlockHeightURL = network => `${insightURL(network)}/status`;

const dcrdataAddressURL = (network, address) => `${dcrdataURL(network)}/address/${address}/raw`;
const insightAddressURL = (network, address) => `${insightURL(network)}/addr/${address}/utxo?noCache=1`;
const FAUCET_URL = "https://faucet.decred.org/requestfaucet";

const POST = (path, params, method = "POST") => {
  var formBody = [];
  for (var key in params) {
    var encodedKey = encodeURIComponent(key);
    var encodedValue = encodeURIComponent(params[key]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return fetch(path, {
    mode: "cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    method,
    body: formBody
  });
};

const getRawTransactions = url => {
  return fetch(url)
    .then(r => {
      // work around when transactions are not paid and dcrdata api returns Unprocessable Entity
      if (r.statusText === "Unprocessable Entity") {
        return null;
      }
      return r.json();
    });
};

export const getHeightByDcrdata = () => {
  const network = NETWORK ? "testnet" : "explorer";
  return getRawTransactions(dcrddataBlockHeightURL(network));
};

export const getHeightByInsight = () => {
  const network = NETWORK ? "testnet" : "explorer";
  return getRawTransactions(insightBlockHeightURL(network));
};

export const getPaymentsByAddressDcrdata = address => {
  const network = address[0] === "T" ? "testnet" : "explorer";
  return getRawTransactions(dcrdataAddressURL(network, address));
};

export const getPaymentsByAddressInsight = address => {
  const network = address[0] === "T" ? "testnet" : "mainnet";
  return getRawTransactions(insightAddressURL(network, address));
};

export const payWithFaucet = (address, amount) => {
  const data = {
    address,
    amount
  };

  return POST(FAUCET_URL, data);
};
