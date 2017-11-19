import { connect } from "react-redux";
import { onResetProposal } from "../actions";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import { arg } from "../lib/fp";

const proposalToken = compose(get(["match", "params", "token"]), arg(1));
const proposalSuccessConnector = connect(
  sel.selectorMap({
    token: proposalToken,
    loggedIn: sel.loggedIn,
    isAdmin: sel.isAdmin,
    proposal: sel.getSubmittedProposal,
    error: sel.proposalError,
    markdownFile: sel.getMarkdownFile,
    otherFiles: sel.getNotMarkdownFile,
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchProposal,
    onResetProposal
  }, dispatch)
);

export default proposalSuccessConnector;
