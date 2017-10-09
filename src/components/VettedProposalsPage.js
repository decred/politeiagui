import React from "react";
import Paginated from "./Paginated";
import ProposalSummary from "./ProposalSummary";
import proposalsConnector from "../connectors/proposals";

const Proposals = (props) => (
  <div className="page vetted-proposals-page">
    <h2>Proposals</h2>
    <Paginated {...props}>
      {({ items }) => (
        <ol className={"proposals-list"}>
          {items.map((proposal, idx) => (
            <li className={"proposal"} key={idx}>
              <ProposalSummary {...{ proposal }} />
            </li>
          ))}
        </ol>
      )}
    </Paginated>
  </div>
);

export default proposalsConnector(Proposals);
