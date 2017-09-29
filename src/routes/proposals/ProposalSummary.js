import { h } from "preact";
import { Link } from "preact-router/match";

const ProposalSummary = ({
  proposal: {
    name,
    timestamp,
    censorshiprecord: {
      token
    }
  }
}) => (
  <div className={"proposal-summary"}>
    <h3><Link href={`/proposals/${token}`}>{name}</Link></h3>
    <div>
      Created {(new Date(timestamp * 1000)).toString()}
    </div>
  </div>
);

export default ProposalSummary;
