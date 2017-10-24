import React from "react";
import { reduxForm, Field } from "redux-form";
import Message from "../Message";
import validate from "./Validator";
import ErrorField from "../Form/Fields/ErrorField";

const ChangePasswordForm = ({
  isApiRequestingChangePassword,
  apiChangePasswordError,
  onChangePassword,
  handleSubmit
}) => isApiRequestingChangePassword ? (
  <fieldset className="change-password-form">Changing password</fieldset>
) : (
  <form onSubmit={handleSubmit(onChangePassword)}>
    <fieldset className="change-password-form">
      <Field
        name="global"
        component={props => <ErrorField title="Cannot change password" {...props} />}
      />
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
      {apiChangePasswordError ? (
        <Message
          type="error"
          header="Change Password failed"
          body={apiChangePasswordError} />
      ) : null}
    </fieldset>
  </form>
);

export default reduxForm({ form: "form/change-password", validate })(ChangePasswordForm);
