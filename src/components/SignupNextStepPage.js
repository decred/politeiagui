import React from "react";
import signupNext from "../connectors/signupNext";
import Link from "./snew/Link";

class SignupNextStepPage extends React.Component {
  componentDidMount() {
    const { isTestnet, email, verificationToken, history } = this.props;
    if (isTestnet && email && verificationToken) {
      history.push(
        `/user/verify?email=${encodeURIComponent(
          email
        )}&verificationtoken=${verificationToken}`
      );
    }
  }

  componentWillUnmount() {
    this.props.onResetNewUser();
  }

  render() {
    const { email, isCMS } = this.props;
    return (
      <div
        className="content page signup-next-step-page"
        role="main"
        style={{ minHeight: "calc(100vh - 350px)" }}>
        <div className="text-wrapper">
          <div className="centered">
            {!isCMS ? (
              <React.Fragment>
                <h3>Please check your inbox to verify your registration.</h3>
                <p>
                  Note that, for privacy reasons, Politeia does not disclose
                  whether an email address has already been registered. If you
                  don't receive an email:
                </p>
                <ul>
                  {email ? (
                    <li>
                      Check that <span className="email-address">{email}</span>{" "}
                      is the correct address.
                    </li>
                  ) : null}
                  <li>Check your spam folder!</li>
                  <li>
                    The verification link needs to be opened with the same
                    browser that you used to sign up.
                  </li>
                  <li>
                    Make sure you don't already have an account on Politeia with
                    this email address. If you do, you should{" "}
                    <a href="/password">reset your account</a> instead.
                  </li>
                </ul>
                <p>
                  If you're sure you should have received an email, join the{" "}
                  <code>#support:decred.org</code> channel on{" "}
                  <a href="https://www.decred.org/matrix/">Matrix</a> to get
                  assistance from Politeia administrators.
                </p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h3>
                  Congratulations, you have fully registered for the Contractor
                  Manangement System!
                </h3>
                <p>
                  You may now log in
                  <Link href="/user/signup" className="login-required">
                    {" "}
                    here
                  </Link>
                </p>
                <br />
                <p>
                  If you're having trouble accessing your account, use the{" "}
                  <code>#support:decred.org</code> channel on{" "}
                  <a href="https://www.decred.org/matrix/">Matrix</a> to get
                  assistance from Politeia administrators.
                </p>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default signupNext(SignupNextStepPage);
