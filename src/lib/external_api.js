const dcrdataURL = (network, address) => `https://${network}.dcrdata.org/api/address/${address}/raw`;
const insightURL = (network, address) => `https://${network}.decred.org/api/addr/${address}/utxo?noCache=1`;
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

const getRawTransactions = (network, address) => {
  return fetch(dcrdataURL(network === "mainnet" ? "explorer" : network, address))
    .then(r => {
      // work around when transactions are not paid and dcrdata api returns Unprocessable Entity
      if (r.statusText === "Unprocessable Entity") {
        return null;
      }
      return r.json();
    })
    .catch(e => {
      console.error("Could not reach dcrdata: " + e);

      // Try with the backup url next.
      return fetch(insightURL(network, address)).then(r => r.json());
    });
};

export const getPaymentsByAddress = address => {
  const network = address[0] === "T" ?
    "testnet" : "mainnet";
  return getRawTransactions(network, address);
};

export const payWithFaucet = (address, amount) => {
  const data = {
    address,
    amount
  };

  return POST(FAUCET_URL, data);
};
