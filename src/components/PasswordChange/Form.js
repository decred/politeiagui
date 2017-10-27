import React from "react";
import { reduxForm, Field } from "redux-form";
import Message from "../Message";

const ChangePasswordForm = ({
  error,
  isApiRequestingChangePassword,
  onChangePassword,
  handleSubmit
}) => isApiRequestingChangePassword ? (
  <fieldset className="change-password-form">Changing password</fieldset>
) : (
  <form onSubmit={handleSubmit(onChangePassword)}>
    {error && <Message
      type="error"
      header="Cannot change password"
      body={error}
    />}
    <fieldset className="change-password-form">
      <Field
        name="existingPassword"
        placeholder="Existing Password"
        component="input"
        type="password"
      />
      <Field
        name="password"
        placeholder="New Password"
        component="input"
        type="password"
      />
      <Field
        name="password_verify"
        placeholder="Verify Password"
        component="input"
        type="password"
      />
      <input type="submit" value="Change Password" />
    </fieldset>
  </form>
);

export default reduxForm({ form: "form/change-password" })(ChangePasswordForm);
