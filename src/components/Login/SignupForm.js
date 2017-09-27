import { h } from "preact";
import signupFormConnector from "../../connectors/signupForm";

const SignupForm = ({
  email,
  password,
  passwordVerify,
  isApiRequestingNewUser,
  isApiRequestingVerifyNewUser,
  apiNewUserError,
  apiVerifyNewUserError,
  onSetEmail,
  onSetPassword,
  onSetPasswordVerify,
  onSignup,
  onCancelSignup
}) => isApiRequestingVerifyNewUser ? (
  <fieldset className={"signup-form"}>Verifying {email}...</fieldset>
) : isApiRequestingNewUser ? (
  <fieldset className={"signup-form"}>Signing up {email}...</fieldset>
) : (
  <fieldset className={"signup-form"}>
    <input
      type={"text"}
      placeholder={"Email Address"}
      value={email}
      onInput={evt => onSetEmail(evt.target.value)}
    />
    <input
      type={"password"}
      placeholder={"Password"}
      value={password}
      onInput={evt => onSetPassword(evt.target.value)}
    />
    <input
      type={"password"}
      placeholder={"Verify Password"}
      value={passwordVerify}
      onInput={evt => onSetPasswordVerify(evt.target.value)}
    />
    <button onClick={onCancelSignup}>Cancel</button>
    <button
      disabled={!email || !password || (password !== passwordVerify)}
      onClick={onSignup}
    >Signup</button>
    {password === passwordVerify ? null : (
      <div className={"error"}>Passwords do not match</div>
    )}
    {apiNewUserError ? (
      <div>
        Signup Error: {apiNewUserError}
      </div>
    ) : null}
    {apiVerifyNewUserError ? (
      <div>
        Signup Verify Error: {apiVerifyNewUserError}
      </div>
    ) : null}
  </fieldset>
);

export default signupFormConnector(SignupForm);
