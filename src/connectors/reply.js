import React, { Component } from "react";
import * as act from "../actions";
import * as sel from "../selectors";
import compose from "lodash/fp/compose";
import { withRouter } from "react-router-dom";
import validate from "../validators/reply";
import { connect } from "react-redux";

const replyConnector = connect(
  sel.selectorMap({
    token: sel.proposalToken,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    keyMismatch: sel.getKeyMismatch,
    userCanExecuteActions: sel.userCanExecuteActions,
    replyTo: sel.replyTo,
    policy: sel.policy,
    isPostingComment: sel.isApiRequestingNewComment,
    userHasPaid: sel.userHasPaid,
    getVoteStatus: sel.getPropVoteStatus,
    likeCommentError: sel.apiLikeCommentError,
    likeCommentPayload: sel.apiLikeCommentPayload
  }),
  {
    onFetchData: act.onGetPolicy,
    onSubmitComment: act.onSubmitComment,
    onSetReplyParent: act.onSetReplyParent,
    onLikeComment: act.onLikeComment,
    onCensorComment: act.onCensorComment
  }
);

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingMarkdownHelp: false,
      commentValue: "",
      validationError: ""
    };
  }

  componentDidMount() {
    this.props.policy || this.props.onFetchData();
    // this.props.initialize(getNewCommentData());
  }

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
          showComentForm: this.state.showComentForm
        }}
      />
    );
  }

  onChange = value => this.setState({ commentValue: value })
  resetForm = () => {
    this.setState({ commentValue: "" });
    this.props.onClose && this.props.onClose();
  }

  onSave(e) {
    e && e.preventDefault && e.preventDefault();
    const { loggedInAsEmail, token, thingId: replyTo, policy } = this.props;
    const { commentValue: comment } = this.state;
    try {
      validate({ values: { comment }, ...this.props }, policy);
    } catch(e) {
      console.log("got error", e);
      this.setState({ validationError: e.errors._error });
      return;
    }
    return this.props
      .onSubmitComment(loggedInAsEmail, token, comment, replyTo)
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
