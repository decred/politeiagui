import React from "react";
import { Link } from "pi-ui";
import { useLoaderContext } from "src/Appv2/Loader";

const DcrTransactionLink = ({ txID }) => {
  const { apiInfo } = useLoaderContext();
  const hostName = apiInfo.testnet ? "testnet" : "explorer";
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={`https://${hostName}.dcrdata.org/tx/${txID}`}
    >
      {txID}
    </Link>
  );
};

export default DcrTransactionLink;
