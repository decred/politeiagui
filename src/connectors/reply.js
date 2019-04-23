import React from "react";
import * as act from "../actions";
import * as sel from "../selectors";
import get from "lodash/fp/get";
import { arg } from "../lib/fp";
import compose from "lodash/fp/compose";
import { withRouter } from "react-router-dom";
import validate from "../validators/reply";
import { connect } from "react-redux";

const replyConnector = connect(
  sel.selectorMap({
    commentid: compose(
      t => (t ? t.toLowerCase() : t),
      get(["match", "params", "commentid"]),
      arg(1)
    ),
    token: sel.proposalToken,
    proposalStatus: sel.proposalStatus,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    proposalAuthor: sel.proposalAuthor,
    keyMismatch: sel.getKeyMismatch,
    userCanExecuteActions: sel.userCanExecuteActions,
    replyTo: sel.replyTo,
    policy: sel.policy,
    isPostingComment: sel.isApiRequestingNewComment,
    userHasPaid: sel.userHasPaid,
    getVoteStatus: sel.getPropVoteStatus,
    likeCommentError: sel.apiLikeCommentError,
    likeCommentPayload: sel.apiLikeCommentPayload,
    userAccessTime: sel.lastLoginTime,
    lastVisit: sel.visitedProposal,
    lastVisitInvoice: sel.visitedInvoice,
    userid: sel.userid,
    invoice: sel.invoice,
    invoiceToken: sel.invoiceToken,
    isCMS: sel.isCMS
  }),
  {
    onFetchData: act.onGetPolicy,
    onSubmitComment: act.onSubmitComment,
    onSetReplyParent: act.onSetReplyParent,
    onLikeComment: act.onLikeComment,
    onCensorComment: act.onCensorComment
  }
);

class Wrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowingMarkdownHelp: false,
      commentValue: "",
      validationError: "",
      showCommentForm: false
    };
  }

  componentDidMount() {
    this.props.policy || this.props.onFetchData();
    // this.props.initialize(getNewCommentData());
  }

  toggleCommentForm = (e, forceValue = null) => {
    e && e.preventDefault && e.preventDefault();
    this.setState({
      showCommentForm:
        forceValue != null ? forceValue : !this.state.showCommentForm
    });
  };

  onCloseCommentForm = () => this.toggleCommentForm(null, false);

  render() {
    const { Component, error, ...props } = this.props;
    const { validationError } = this.state;
    return (
      <Component
        {...{
          ...props,
          ...this.state,
          onChange: this.onChange,
          error: error || validationError,
          value: this.state.commentValue,
          onSave: this.onSave.bind(this),
          onToggleMarkdownHelp: this.onToggleMarkdownHelp.bind(this),
          showCommentForm: this.state.showCommentForm,
          toggleCommentForm: this.toggleCommentForm,
          onCloseCommentForm: this.onCloseCommentForm
        }}
      />
    );
  }

  onChange = value => {
    this.setState({ commentValue: value, validationError: "" });
  };

  resetForm = () => {
    this.setState({ commentValue: "", showCommentForm: false });
    this.props.onClose && this.props.onClose();
  };

  onSave(e) {
    e && e.preventDefault && e.preventDefault();
    const {
      loggedInAsEmail,
      token,
      thingId: replyTo,
      policy,
      commentid,
      invoiceToken,
      isCMS
    } = this.props;
    const { commentValue } = this.state;
    const comment = commentValue.trim();
    try {
      validate({ values: { comment }, ...this.props }, policy);
    } catch (e) {
      this.setState({ validationError: e.errors._error });
      return;
    }
    return this.props
      .onSubmitComment(
        loggedInAsEmail,
        token || invoiceToken,
        comment,
        replyTo,
        commentid,
        isCMS
      )
      .then(() => this.resetForm());
  }

  onToggleMarkdownHelp() {
    this.setState({ isShowingMarkdownHelp: !this.state.isShowingMarkdownHelp });
  }
}

const wrap = Component =>
  replyConnector(props => <Wrapper {...{ ...props, Component }} />);
export default compose(
  withRouter,
  wrap
);
