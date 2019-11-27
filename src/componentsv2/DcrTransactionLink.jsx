import React from "react";
import { Link } from "pi-ui";
import { useLoaderContext } from "src/Appv2/Loader";

const DcrTransactionLink = ({ txID }) => {
  const { apiInfo } = useLoaderContext();
  const hostName = apiInfo.testnet ? "testnet.dcrdata" : "dcrdata.decred";
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      className="use-ellipsis"
      href={`https://${hostName}.org/tx/${txID}`}
    >
      {txID}
    </Link>
  );
};

export default DcrTransactionLink;
