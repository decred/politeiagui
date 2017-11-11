import React, { Component } from "react";
import * as act from "../actions";
import * as sel from "../selectors";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import validate from "../validators/reply";
import { connect } from "react-redux";

const replyConnector = connect(
  sel.selectorMap({
    token: sel.proposalToken,
    replyTo: sel.replyTo,
    isPostingComment: sel.isApiRequestingNewComment
  }),
  {
    onSubmitComment: act.onSubmitComment,
    onSetReplyParent: act.onSetReplyParent
  }
);

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { isShowingMarkdownHelp: false };
  }

  render () {
    const { Component, ...props } = this.props;
    return <Component {...{ ...props, ...this.state,
      onSave: this.onSave.bind(this),
      onToggleMarkdownHelp: this.onToggleMarkdownHelp.bind(this)
    }} />;
  }

  onSave(props, ...args) {
    validate(props, ...args);
    const { token, replyTo } = this.props;
    const { comment } = props;
    return this.props.onSubmitComment(token, comment, replyTo)
      .then(() => this.props.onSetReplyParent());
  }

  onToggleMarkdownHelp() {
    this.setState({ isShowingMarkdownHelp: !this.state.isShowingMarkdownHelp});
  }
}

const wrap = (Component) => replyConnector(props => <Wrapper {...{...props, Component}} />);
export default compose(withRouter, reduxForm({ form: "form/reply" }), wrap);
