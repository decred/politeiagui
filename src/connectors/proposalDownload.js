import { connect } from "react-redux";
import * as sel from "../selectors";

const proposalDownloadConnector = connect(
  sel.selectorMap({
    proposal: sel.proposal,
    serverIdentity: sel.serverIdentity
  })
);

export default proposalDownloadConnector;
