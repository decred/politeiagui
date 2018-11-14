import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";
import { buildCommentsTree } from "../lib/snew";

const proposalConnector = connect(
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
    userid: sel.userid,
    censoredComment: sel.censoredComment,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    proposal: sel.proposal,
    comments: sel.proposalComments,
    commentsvotes: sel.commentsVotes,
    error: or(sel.proposalError, sel.apiPropVoteStatusError),
    isLoading: or(
      sel.proposalIsRequesting,
      sel.setStatusProposalIsRequesting,
      sel.isApiRequestingPropVoteStatus
    ),
    markdownFile: sel.getMarkdownFile,
    otherFiles: sel.getNotMarkdownFile,
    commentsSortOption: sel.commentsSortOption
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchProposal,
        onSetReplyParent: act.onSetReplyParent,
        onFetchProposalVoteStatus: act.onFetchProposalVoteStatus,
        onFetchLikedComments: act.onFetchLikedComments,
        onSetCommentsSortOption: act.onSetCommentsSortOption,
        resetLastSubmittedProposal: act.resetLastSubmittedProposal,
        onVisitedProposal: act.onVisitedProposal
      },
      dispatch
    )
);

class Wrapper extends React.PureComponent {
  componentDidMount() {
    this.props.onSetReplyParent();
  }

  handleViewAllClick = e => {
    e && e.preventDefault() && e.stopPropagation();
    this.props.history.push(`/proposals/${this.props.token}`);
  };

  // create data structure with all the comments on thread uniquely
  buildSetOfComments = tree => {
    const set = new Set();
    Object.keys(tree).forEach(key => {
      tree[key] && tree[key].forEach(item => item && set.add(item));
      key && key !== "0" && set.add(key);
    });
    return set;
  };

  render() {
    const { Component, ...props } = this.props;
    const { tree } = buildCommentsTree(props.comments, props.commentid);
    const commentsSet = this.buildSetOfComments(tree);
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

const wrap = Component =>
  withRouter(
    proposalConnector(props => <Wrapper {...{ ...props, Component }} />)
  );
export default wrap;
