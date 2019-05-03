import React from "react";
import Link from "./Link";
import {
  TESTNET_PROPOSALS_REPOSITORY,
  MAINNET_PROPOSALS_REPOSITORY
} from "../../constants";
import privacyConnector from "../../connectors/privacy";

class PrivacyPolicy extends React.Component {
  render() {
    const { isCMS, isTestnet } = this.props;
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
                    The <Link href="/">proposals.decred.org</Link> database
                    stores your account email address, username, cryptographic
                    identity public key(s), IP addresses and payment transaction
                    details - and associates this data with all of your
                    proposals, comments and up/down votes.
                  </li>
                  <li>
                    Your email address will be kept private and will not be
                    shared with any third parties.
                  </li>
                  <li>
                    In the interests of transparency, data associating your
                    public key with content contributions will be published
                    openly in the Decred-proposals repository here:{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={
                        isTestnet
                          ? TESTNET_PROPOSALS_REPOSITORY
                          : MAINNET_PROPOSALS_REPOSITORY
                      }
                      style={{ fontSize: "1.01em" }}
                    >
                      {`${
                        isTestnet
                          ? TESTNET_PROPOSALS_REPOSITORY
                          : MAINNET_PROPOSALS_REPOSITORY
                      }`}
                    </a>
                  </li>
                </ul>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h3>Privacy Policy</h3>
                <ul>
                  <li>
                    The <Link href="/">cms.decred.org</Link> database stores
                    your account email address, username, cryptographic identity
                    public key(s), IP addresses and invoice transaction details
                    - and associates this data with all of your invoices,
                    comments and up/down votes.
                  </li>
                  <li>
                    Your email address will be kept private and will not be
                    shared with any third parties.
                  </li>
                </ul>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default privacyConnector(PrivacyPolicy);
