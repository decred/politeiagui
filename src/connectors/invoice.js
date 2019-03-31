import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";

const invoiceConnector = connect(
  sel.selectorMap({
    token: compose(
      t => (t ? t.toLowerCase() : t),
      get(["match", "params", "token"]),
      arg(1)
    ),
    commentid: compose(
      t => (t ? t.toLowerCase() : t),
      get(["match", "params", "commentid"]),
      arg(1)
    ),
    tempThreadTree: sel.getTempThreadTree,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    proposal: sel.invoice,
    comments: sel.invoiceComments,
    commentslikes: sel.commentsLikes || [],
    error: or(sel.proposalError, sel.apiPropVoteStatusError),
    isLoading: sel.invoiceIsRequesting,
    markdownFile: sel.getInvoiceJSON,
    otherFiles: sel.getNotJSONFile,
    commentsSortOption: sel.commentsSortOption,
    openedModals: sel.getopenedModals,
    isCMS: sel.isCMS
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchInvoice,
        onSetReplyParent: act.onSetReplyParent,
        onFetchLikedComments: act.onFetchLikedComments,
        onSetCommentsSortOption: act.onSetCommentsSortOption,
        resetLastSubmittedProposal: act.resetLastSubmittedProposal
      },
      dispatch
    )
);

export default invoiceConnector;
