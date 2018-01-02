const dcrdataURL = (network, address) => `https://${network}.dcrdata.org/api/address/${address}/raw`;
const getRawAddresses = (network, address) => fetch(dcrdataURL(network, address)).then(r=>{
  return r.json();
});

export const getPaymentsByAddress = address => {
  if(process.env.NODE_ENV === "development" || !process.env.NODE_ENV)
    return getRawAddresses("testnet", address);
  else
    return getRawAddresses("explorer", address);
};
