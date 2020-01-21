import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";
import { buildCommentsTree, buildSetOfComments } from "../lib/snew";
import { useDCC } from "../components/DCC/DCCProvider";

const proposalConnector = connect(
  sel.selectorMap({
    token: compose(
      (t) => (t ? t.toLowerCase() : t),
      get(["match", "params", "token"]),
      arg(1)
    ),
    commentid: compose(
      (t) => (t ? t.toLowerCase() : t),
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
    isLoading: or(
      sel.proposalIsRequesting,
      sel.setStatusProposalIsRequesting,
      sel.isApiRequestingPropVoteStatus
    ),
    markdownFile: sel.getMarkdownFile,
    otherFiles: sel.getNotMarkdownFile,
    commentsSortOption: sel.commentsSortOption,
    openedModals: sel.getopenedModals,
    isCMS: sel.isCMS,
    dccComments: sel.dccComments
  }),
  (dispatch) =>
    bindActionCreators(
      {
        onFetchData: act.onFetchProposalApp,
        onSetReplyParent: act.onSetReplyParent,
        onFetchProposalVoteStatus: act.onFetchProposalVoteStatus,
        onFetchLikedComments: act.onFetchLikedComments,
        onSetCommentsSortOption: act.onSetCommentsSortOption,
        resetLastSubmittedProposal: act.resetLastSubmittedProposal
      },
      dispatch
    )
);

class Wrapper extends React.PureComponent {
  componentDidMount() {
    this.props.onSetReplyParent();
  }

  handleViewAllClick = (e) => {
    e && e.preventDefault() && e.stopPropagation();
    !this.props.isCMS
      ? this.props.history.push(`/proposals/${this.props.token}`)
      : !this.props.isDCC
      ? this.props.history.push(`/invoices/${this.props.token}`)
      : this.props.history.push(`/dcc/${this.props.token}`);
  };

  render() {
    const { Component, ...props } = this.props;
    const { tree } = !props.isCMS
      ? buildCommentsTree(props.comments, props.commentid)
      : !props.isDCC
      ? buildCommentsTree(props.invoiceComments, props.commentid)
      : buildCommentsTree(props.dccComments, props.commentid);
    const commentsSet = buildSetOfComments(tree);
    return (
      <Component
        {...{
          ...props,
          onViewAllClick: this.handleViewAllClick,
          numofcomments: commentsSet.size
        }}
      />
    );
  }
}

const wrap = (Component) =>
  withRouter(
    proposalConnector((props) => {
      const { isDCC } = useDCC();
      return <Wrapper {...{ ...props, Component, isDCC }} />;
    })
  );
export default wrap;
