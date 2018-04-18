import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const proposalDownloadConnector = connect(
  sel.selectorMap({
    isProposalStatusApproved: sel.isProposalStatusApproved,
  }),
  {
    onChangeProposalStatusApproved: act.onChangeProposalStatusApproved,
  }
);

export default proposalDownloadConnector;
