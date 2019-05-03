import { useEffect, useCallback } from "react";
import * as sel from "../../selectors";
import * as act from "../../actions";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "../../lib/fp";
import { useApp } from "../../App";
import { makeHookConnector, useRedux } from "../../lib/redux";
import { buildCommentsTree, buildSetOfComments } from "../../lib/snew";

const mapStateToProps = {
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
  userid: sel.userid,
  censoredComment: sel.censoredComment,
  loggedInAsEmail: sel.loggedInAsEmail,
  isAdmin: sel.isAdmin,
  record: sel.proposal,
  comments: sel.proposalComments,
  invoice: sel.invoice,
  invoiceComments: sel.invoiceComments,
  commentslikes: sel.commentsLikes,
  error: or(sel.proposalError, sel.apiPropVoteStatusError),
  isLoading: or(sel.proposalIsRequesting, sel.setStatusProposalIsRequesting),
  markdownFile: sel.getMarkdownFile,
  otherFiles: sel.getNotMarkdownFile,
  commentsSortOption: sel.commentsSortOption,
  openedModals: sel.getopenedModals,
  isCMS: sel.isCMS
};

const mapDispatchToProps = {
  onFetchData: act.onFetchProposalApp,
  onSetReplyParent: act.onSetReplyParent,
  onFetchProposalVoteStatus: act.onFetchProposalVoteStatus,
  onFetchLikedComments: act.onFetchLikedComments,
  onSetCommentsSortOption: act.onSetCommentsSortOption,
  resetLastSubmittedProposal: act.resetLastSubmittedProposal
};

export function useProposal(props) {
  const { history } = useApp();
  const fromRedux = useRedux(props, mapStateToProps, mapDispatchToProps);

  const onViewAllClick = useCallback(e => {
    e && e.preventDefault() && e.stopPropagation();
    !fromRedux.isCMS
      ? history.push(`/proposals/${this.props.token}`)
      : history.push(`/invoices/${this.props.token}`);
  });

  useEffect(() => {
    fromRedux.onSetReplyParent();
  }, []);

  const { tree } = !props.isCMS
    ? buildCommentsTree(props.comments, props.commentid)
    : buildCommentsTree(props.invoiceComments, props.commentid);
  const commentsSet = buildSetOfComments(tree);
  const numofcomments = commentsSet.size;

  return { ...fromRedux, onViewAllClick, numofcomments };
}

export const proposalConnector = makeHookConnector(useProposal);
