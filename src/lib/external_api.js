import { TESTNET, MAINNET, EXPLORER } from "../constants";

const getSubdomainForDcrdata = isTestnet => isTestnet ? TESTNET : EXPLORER;
const getSubdomainForInsight = isTestnet => isTestnet ? TESTNET : MAINNET;

const dcrdataURL = isTestnet => `https://${getSubdomainForDcrdata(isTestnet)}.dcrdata.org/api`;
const insightURL = isTestnet => `https://${getSubdomainForInsight(isTestnet)}.decred.org/api`;

export const dcrddataBlockHeightURL = isTestnet => `${dcrdataURL(isTestnet)}/block/best/height`;
export const insightBlockHeightURL = isTestnet => `${insightURL(isTestnet)}/status`;

const dcrdataAddressURL = (isTestnet, address) => `${dcrdataURL(isTestnet)}/address/${address}/raw`;
const insightAddressURL = (isTestnet, address) => `${insightURL(isTestnet)}/addr/${address}/utxo?noCache=1`;
const FAUCET_URL = "https://faucet.decred.org/requestfaucet";

const POST = (path, params, method = "POST") => {
  let formBody = [];
  for (const key in params) {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(params[key]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return fetch(path, {
    mode: "cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    method,
    body: formBody
  }).then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
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

const addressFromTestnet = addr => addr[0] === "T";

export const getHeightByDcrdata = isTestnet =>
  getRawTransactions(dcrddataBlockHeightURL(isTestnet));

export const getHeightByInsight = isTestnet =>
  getRawTransactions(insightBlockHeightURL(isTestnet));

export const getPaymentsByAddressDcrdata = address => {
  const isTestnet = addressFromTestnet(address);
  return getRawTransactions(dcrdataAddressURL(isTestnet, address));
};

export const getPaymentsByAddressInsight = address => {
  const isTestnet = addressFromTestnet(address);
  return getRawTransactions(insightAddressURL(isTestnet, address));
};

export const payWithFaucet = (address, amount) => {
  const data = {
    address,
    amount,
    json: true
  };

  return POST(FAUCET_URL, data);
};
