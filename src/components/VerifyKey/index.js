import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { isEmpty } from "lodash";
import PageLoadingIcon from "../snew/PageLoadingIcon";
import verifyKeyConnector from "../../connectors/verifyKey";
import qs from "query-string";
import Message from "../Message";

class VerifyKey extends Component {
  componentWillMount() {
    if (isEmpty(this.props.location.search)) {
      this.props.history.push("/user/login");
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.email && nextProps.email) {
      const { verificationtoken } = qs.parse(this.props.location.search);
      const { email } = nextProps;
      this.props.onVerify(email, verificationtoken);
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
          {verifyUserKey  && verifyUserKey.success &&
            <Message
              type="success"
              header="Verification successful"
              body="You have successfully verified your new key and may continue to use Politeia normally."
            />
          }
        </div>
      </div>
    );
  }
}

VerifyKey.PropTypes = {
  email: PropTypes.string.isRequired,
  verifyUserKey: PropTypes.object,
  verifyUserKeyError: PropTypes.object,
  onVerify: PropTypes.func.isRequired
};

export default verifyKeyConnector(withRouter(VerifyKey));
