import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";

const singleCommentConnector = connect(
  sel.selectorMap({
    token: compose(
      t => t ? t.toLowerCase() : t,
      get([ "match", "params", "token" ]),
      arg(1)
    ),
    commentid: compose(
      t => t ? t.toLowerCase() : t,
      get([ "match", "params", "commentid" ]),
      arg(1)
    ),
    censoredComment: sel.censoredComment,
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

  getCommentsOnThread = () => {
    const comments = this.props.comments;
    const commentid = this.props.commentid;
    const commentsonthread = [];

    const getParent = (comments, commentid) => {
      comments.forEach((comment, i) => {
        if (comment.commentid === commentid) { //found comment
          const parentid = comment.parentid;
          commentsonthread.push(comment);
          comments.slice(0, i);
          if (parentid === "0") return; //doesn't have parent
          getParent(comments, parentid);
        }
      });
    };

    const getChild = (comments, commentid) => {
      for(let i=0; i<comments.length; i++) {
        if (comments[i].parentid === commentid) { //found child
          const childid = comments[i].commentid;
          commentsonthread.push(comments[i]);
          getChild(comments, childid);
        }
      }
    };

    getParent(comments, commentid);
    getChild(comments, commentid);

    return commentsonthread;
  }

  render () {
    const { Component, ...props } = this.props;
    return <Component {...{ ...props, comments: this.getCommentsOnThread() }} />;
  }
}

const wrap = (Component) => singleCommentConnector(props => <Wrapper {...{ ...props, Component }} />);
export default wrap;

