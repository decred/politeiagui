import React, { Component } from "react";
import { autobind } from "core-decorators";
import { withRouter } from "react-router";
import { SubmissionError } from "redux-form";
import LoginForm from "./LoginForm";
import CurrentUser from "./CurrentUser";
import loginConnector from "../../connectors/login";
import validate from "./LoginValidator";

class Login extends Component {
  componentWillReceiveProps({ loggedInAs, redirectedFrom, resetRedirectedFrom, history }) {
    if (loggedInAs && redirectedFrom) {
      resetRedirectedFrom();
      history.push(redirectedFrom);
    }
  }

  render() {
    return (
      <div className="login-form">
        {this.props.loggedInAs ? (
          <CurrentUser />
        ) : (
          <LoginForm {...{
            ...this.props,
            onLogin: this.onLogin
          }} />
        )}
      </div>
    );
  }

  onLogin(...args) {
    validate(...args);
    return this.props.onLogin(...args)
      .then(() => {
        if(this.props.isAdmin) {
          this.props.history.push("/admin/unreviewed");
        }
        else {
          this.props.history.push("/proposals/new");
        }
      })
      .catch((error) => {
        throw new SubmissionError({
          _error: error.message,
        });
      });
  }
}

autobind(Login);

export default loginConnector(withRouter(Login));
