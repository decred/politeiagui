import React from "react";

const DcrdataTxLink = ({ isTestnet, txId, isTxId }) => {
  const network = isTestnet ? "testnet" : "explorer";
  return !isTxId ? (
    <span>{txId}</span>
  ) : (
    <a
      href={`https://${network}.dcrdata.org/tx/${txId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {txId}
    </a>
  );
};

export default DcrdataTxLink;
