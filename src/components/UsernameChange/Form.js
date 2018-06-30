import React from "react";
import { reduxForm, Field } from "redux-form";
import Message from "../Message";
import { PageLoadingIcon } from "../snew";
import { getUsernameFieldLabel } from "../../helpers";

const ChangeUsernameForm = ({
  error,
  isApiRequestingChangeUsername,
  policy,
  onChangeUsername,
  handleSubmit
}) => isApiRequestingChangeUsername ? (
  <PageLoadingIcon />
) : (
  <form className="change-username-form" onSubmit={handleSubmit(onChangeUsername)}>
    {error && <Message
      type="error"
      header="Cannot change username"
      body={error}
    />}
    <div className="c-form-group">
      <label className="screenreader-only" htmlFor="username">
        New Username:
      </label>
      <Field
        className="c-form-control"
        id="newUsername"
        name="newUsername"
        component="input"
        type="username"
        placeholder={getUsernameFieldLabel(policy, "New Username")}
        tabIndex={3} />
    </div>
    <div className="c-form-group">
      <label className="screenreader-only" htmlFor="password">
        Current Password:
      </label>
      <Field
        className="c-form-control"
        id="password"
        name="password"
        component="input"
        type="password"
        placeholder="Current Password"
        tabIndex={3} />
    </div>
    <div className="c-clearfix c-submit-group">
      <button
        className="c-btn c-btn-primary c-pull-right"
        tabIndex={3}
        type="submit"
      >
        Change Username
      </button>
    </div>
  </form>
);

export default reduxForm({ form: "form/change-username" })(ChangeUsernameForm);
