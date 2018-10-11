import React from "react";

const DcrdataTxLink = ({
  isTestnet,
  txId
}) => {
  const network = isTestnet ? "testnet" : "explorer";
  return (
    <a href={`https://${network}.dcrdata.org/tx/${txId}`} target="_blank" rel="noopener noreferrer">
      {txId}
    </a>
  );
};

export default DcrdataTxLink;
