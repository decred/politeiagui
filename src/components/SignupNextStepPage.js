import React from "react";
import signupNext from "../connectors/signupNext";

class SignupNextStepPage extends React.Component {
  componentDidMount () {
    const { isTestnet, email, verificationToken, history } = this.props;
    if (isTestnet && email && verificationToken) {
      history.push(`/user/verify?email=${encodeURIComponent(email)}&verificationtoken=${verificationToken}`);
    }
  }

  componentWillUnmount() {
    this.props.onResetNewUser();
  }

  render () {
    const { email } = this.props;
    return (
      <div className="content page signup-next-step-page" role="main" style={{ minHeight: "calc(100vh - 350px)" }}>
        <h3>Please check your inbox to verify your registration.</h3>
        <p>
          Note that, for privacy reasons, Politeia does not disclose whether an
          email address has already been registered. If you don't receive an
          email:
        </p>
        <ul>
          {email ? (
            <li>
              Check that <span className="email-address">{email}</span> is the
              correct address.
            </li>
          ) : null}
          <li>Check your spam folder!</li>
          <li>
            The verification link needs to be opened with the same browser
            that you used to sign up.
          </li>
          <li>
            Make sure you don't already have an account on Politeia with this
            email address. If you do, you should{" "}
            <a href="/password">reset your account</a> instead.
          </li>
        </ul>
        <p>
          If you're sure you should have received an email, join the{" "}
          <code>#support</code> channel on{" "}
          <a href="https://docs.decred.org/support-directory/#join-us-on-slack">
            our Slack
          </a>{" "}
          to get assistance from Politeia administrators.
        </p>
      </div>
    );
  }
}

export default signupNext(SignupNextStepPage);
