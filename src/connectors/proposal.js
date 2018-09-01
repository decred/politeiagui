import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";

const proposalConnector = connect(
  sel.selectorMap({
    token: compose(
      t => t ? t.toLowerCase() : t,
      get([ "match", "params", "token" ]),
      arg(1)
    ),
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    proposal: sel.proposal,
    comments: sel.proposalComments,
    commentsvotes: sel.commentsVotes,
    error: or(sel.proposalError, sel.apiPropVoteStatusError),
    isLoading: or(sel.proposalIsRequesting, sel.setStatusProposalIsRequesting, sel.isApiRequestingPropVoteStatus),
    markdownFile: sel.getMarkdownFile,
    otherFiles: sel.getNotMarkdownFile,
    commentsSortOption: sel.commentsSortOption
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchProposal,
    onSetReplyParent: act.onSetReplyParent,
    onFetchProposalVoteStatus: act.onFetchProposalVoteStatus,
    onFetchLikedComments: act.onFetchLikedComments,
    onSetCommentsSortOption: act.onSetCommentsSortOption,
    resetLastSubmittedProposal: act.resetLastSubmittedProposal
  }, dispatch)
);

class Wrapper extends Component {
  componentDidMount() {
    this.props.onSetReplyParent();
  }

  render () {
    const { Component, ...props } = this.props;
    return <Component {...{ ...props }} />;
  }
}

const wrap = (Component) => proposalConnector(props => <Wrapper {...{ ...props, Component }} />);
export default wrap;

