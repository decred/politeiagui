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
    token: compose(get(["match", "params", "token"]), arg(1)),
    loggedIn: sel.loggedIn,
    isAdmin: sel.isAdmin,
    proposal: sel.proposal,
    comments: sel.proposalComments,
    error: sel.proposalError,
    isLoading: or(sel.proposalIsRequesting, sel.setStatusProposalIsRequesting, sel.isApiRequestingActiveVotes, sel.isApiRequestingVoteResults),
    markdownFile: sel.getMarkdownFile,
    otherFiles: sel.getNotMarkdownFile,
    activeVotes: sel.activeVotes,
    voteDetails: sel.voteResultsVote,
    castedVotes: sel.voteResultsCastVotes
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchProposal,
    onSetReplyParent: act.onSetReplyParent,
    onFetchActiveVotes: act.onFetchActiveVotes,
    onFetchVoteResults: act.onFetchVoteResults
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

const wrap = (Component) => proposalConnector(props => <Wrapper {...{...props, Component}} />);
export default wrap;

