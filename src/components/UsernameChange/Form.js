import React from "react";
import { reduxForm, Field } from "redux-form";
import Message from "../Message";
import { getUsernameFieldLabel } from "../../helpers";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";

const ChangeUsernameForm = ({
  error,
  isApiRequestingChangeUsername,
  policy,
  onChangeUsername,
  handleSubmit
}) => (
  <form
    className="change-username-form"
    onSubmit={handleSubmit(onChangeUsername)}
  >
    {error && (
      <Message type="error" header="Cannot change username" body={error} />
    )}
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
        tabIndex={3}
      />
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
        tabIndex={3}
      />
    </div>
    <div className="c-clearfix c-submit-group">
      <ButtonWithLoadingIcon
        className="c-btn c-btn-primary c-pull-left"
        tabIndex={3}
        type="submit"
        text="Change Username"
        isLoading={isApiRequestingChangeUsername}
      />
    </div>
  </form>
);

export default reduxForm({ form: "form/change-username" })(ChangeUsernameForm);
