import React, { Component } from "react";
import propTypes from "prop-types";
import { withRouter } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import qs from "query-string";
import * as pki from "../../lib/pki";
import PageLoadingIcon from "../snew/PageLoadingIcon";
import verifyKeyConnector from "../../connectors/verifyKey";
import Message from "../Message";
import { verifyUserPubkey } from "../../helpers";

class VerifyKey extends Component {
  constructor(props) {
    super();
    const { verificationtoken } = qs.parse(props.location.search);
    if (
      isEmpty(props.location.search) ||
      !verificationtoken ||
      typeof verificationtoken !== "string"
    ) {
      props.history.push("/user/login");
    }
    const { email } = props;
    if (email && verificationtoken) {
      props.onVerifyUserKey(email, verificationtoken);
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.email && this.props.email) {
      const { verificationtoken } = qs.parse(this.props.location.search);
      const { email } = this.props;
      this.props.onVerifyUserKey(email, verificationtoken);
    }
    const {
      verifyUserKey,
      apiMeResponse,
      loggedInAsEmail,
      userPubkey,
      keyMismatchAction
    } = this.props;
    if (
      verifyUserKey &&
      verifyUserKey.success &&
      apiMeResponse &&
      loggedInAsEmail
    ) {
      verifyUserPubkey(loggedInAsEmail, userPubkey, keyMismatchAction);
      pki.myPubKeyHex(loggedInAsEmail).then(pubkey => {
        if (pubkey !== apiMeResponse.publickey) {
          this.props.updateMe({
            ...this.props.apiMeResponse,
            publickey: pubkey
          });
        }
      });
    }
  }

  render() {
    const { verifyUserKey, verifyUserKeyError } = this.props;
    return (
      <div className="content" role="main">
        <div className="page verification-page">
          {!verifyUserKey && !verifyUserKeyError && <PageLoadingIcon />}
          {verifyUserKeyError && (
            <Message
              type="error"
              header="Verification failed"
              body={verifyUserKeyError.message}
            />
          )}
          {verifyUserKey && verifyUserKey.success && (
            <Message
              type="success"
              header="Verification successful"
              body="You have verified and activated your new identity."
            />
          )}
        </div>
      </div>
    );
  }
}

VerifyKey.propTypes = {
  email: propTypes.string.isRequired,
  verifyUserKey: propTypes.object,
  verifyUserKeyError: propTypes.object,
  onVerify: propTypes.func
};

export default verifyKeyConnector(withRouter(VerifyKey));
