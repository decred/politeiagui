import React from "react";

class PrivacyPolicy extends React.Component {
  render() {
    const { isCMS } = this.props;
    return (
      <div
        className="content page signup-next-step-page"
        role="main"
        style={{ minHeight: "calc(100vh - 350px)" }}
      >
        <div className="text-wrapper">
          <div className="centered">
            {!isCMS ? (
              <React.Fragment>
                <h3>Privacy Policy</h3>
                <ul>
                  <li>
                    The proposals.decred.org database stores your account email
                    address, user-name, cryptographic identity public key(s), IP
                    addresses and payment transaction details - and associates
                    this data with all of your proposals, comments and up/down
                    votes.
                  </li>
                  <li>
                    Your email address will be kept private and will not be
                    shared with any third parties.
                  </li>
                  <li>
                    In the interests of transparency, data associating your
                    public key with content contributions will be published
                    openly in the Decred-proposals repository.
                  </li>
                </ul>
              </React.Fragment>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default PrivacyPolicy;
