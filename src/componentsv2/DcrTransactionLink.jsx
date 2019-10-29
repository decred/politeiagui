import React from "react";
import { Link } from "pi-ui";
import { useLoaderContext } from "src/containers/Loader";

const DcrTransactionLink = ({ txID }) => {
  const { apiInfo } = useLoaderContext();
  const hostName = apiInfo.testnet ? "testnet" : "explorer";
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      className="use-ellipsis"
      href={`https://${hostName}.dcrdata.org/tx/${txID}`}
    >
      {txID}
    </Link>
  );
};

export default DcrTransactionLink;
