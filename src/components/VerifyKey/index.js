import React, { Component } from "react";
import propTypes from "prop-types";
import { withRouter } from "react-router";
import { isEmpty } from "lodash";
import * as pki from "../../lib/pki";
import PageLoadingIcon from "../snew/PageLoadingIcon";
import verifyKeyConnector from "../../connectors/verifyKey";
import qs from "query-string";
import Message from "../Message";

class VerifyKey extends Component {
  componentWillMount() {
    const { verificationtoken } = qs.parse(this.props.location.search);
    if (isEmpty(this.props.location.search) || !verificationtoken || typeof(verificationtoken) !== "string") {
      this.props.history.push("/user/login");
    }
    const { email } = this.props;
    if(email && verificationtoken) {
      this.props.onVerifyUserKey(email, verificationtoken);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.email && nextProps.email) {
      const { verificationtoken } = qs.parse(this.props.location.search);
      const { email } = nextProps;
      this.props.onVerifyUserKey(email, verificationtoken);
    }
    const { verifyUserKey, apiMeResponse, loggedInAsEmail } = nextProps;
    if(verifyUserKey && verifyUserKey.success && apiMeResponse && loggedInAsEmail) {
      pki.myPubKeyHex(loggedInAsEmail).then((pubkey) => {
        if(pubkey !== apiMeResponse.publickey) {
          this.props.updateMe({ ...nextProps.apiMeResponse, publickey: pubkey });
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
          {verifyUserKeyError &&
            <Message
              type="error"
              header="Verification failed"
              body={verifyUserKeyError.message}
            />
          }
          {verifyUserKey && verifyUserKey.success &&
            <Message
              type="success"
              header="Verification successful"
              body="You have verified and activated your new identity." />
          }
        </div>
      </div>
    );
  }
}

VerifyKey.propTypes = {
  email: propTypes.string.isRequired,
  verifyUserKey: propTypes.object,
  verifyUserKeyError: propTypes.object,
  onVerify: propTypes.func.isRequired
};

export default verifyKeyConnector(withRouter(VerifyKey));
