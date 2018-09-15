import { connect } from "react-redux";
import * as sel from "../selectors";

const proposalDownloadConnector = connect(
  sel.selectorMap({
    proposal: sel.proposal,
    proposalComments: sel.proposalComments,
    serverPubkey: sel.serverPubkey
  })
);

export default proposalDownloadConnector;
