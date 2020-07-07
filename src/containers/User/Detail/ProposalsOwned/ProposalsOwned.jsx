import React from "react";
import ProposalBilling from "./ProposalBilling";
// import Link from "src/components/Link";

const ProposalsOwned = ({ proposalsOwned }) => {
  return (
    <>
      {proposalsOwned &&
        proposalsOwned.map((p) => {
          return <ProposalBilling key={p} token={p} />;
        })}
    </>
  );
};

export default ProposalsOwned;
