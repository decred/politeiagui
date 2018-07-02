import React, { Component } from "react";
import * as act from "../actions";
import * as sel from "../selectors";
import compose from "lodash/fp/compose";
import { reduxForm, initialize } from "redux-form";
import { withRouter } from "react-router-dom";
import validate from "../validators/reply";
import { connect } from "react-redux";
import { getNewCommentData } from "../lib/editors_content_backup";

const replyConnector = connect(
  sel.selectorMap({
    token: sel.proposalToken,
    loggedInAsEmail: sel.loggedInAsEmail,
    keyMismatch: sel.getKeyMismatch,
    userCanExecuteActions: sel.userCanExecuteActions,
    replyTo: sel.replyTo,
    policy: sel.policy,
    isPostingComment: sel.isApiRequestingNewComment,
    userHasPaid: sel.userHasPaid,
    getVoteStatus: sel.getPropVoteStatus
  }),
  {
    initialize: data => initialize("form/reply", data),
    onFetchData: act.onGetPolicy,
    onSubmitComment: act.onSubmitComment,
    onSetReplyParent: act.onSetReplyParent,
    onLikeComment: act.onLikeComment
  }
);

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { isShowingMarkdownHelp: false };
  }

  componentDidMount() {
    this.props.policy || this.props.onFetchData();
    this.props.initialize(getNewCommentData());
  }

  render() {
    const { Component, ...props } = this.props;
    return (
      <Component
        {...{
          ...props,
          ...this.state,
          onSave: this.onSave.bind(this),
          onToggleMarkdownHelp: this.onToggleMarkdownHelp.bind(this)
        }}
      />
    );
  }

  onSave(values) {
    const { loggedInAsEmail, token, replyTo, policy } = this.props;
    validate({ values, ...this.props }, policy);
    const { comment } = values;
    return this.props
      .onSubmitComment(loggedInAsEmail, token, comment, replyTo)
      .then(() => this.props.onSetReplyParent());
  }

  onToggleMarkdownHelp() {
    this.setState({ isShowingMarkdownHelp: !this.state.isShowingMarkdownHelp });
  }
}

const wrap = Component =>
  replyConnector(props => <Wrapper {...{ ...props, Component }} />);
export default compose(
  withRouter,
  reduxForm({ form: "form/reply" }),
  wrap
);
