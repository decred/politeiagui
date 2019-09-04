import isEmpty from "lodash/isEmpty";
import { Message } from "pi-ui";
import qs from "query-string";
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import SingleContentPage from "src/componentsv2/layout/SingleContentPage";
import { verifyUserPubkey } from "src/helpers";
import useVerifyKey from "src/hooks/api/useVerifyKey";
import * as pki from "src/lib/pki";

const VerifyKey = ({ location, history }) => {
  const {
    apiMeResponse,
    loggedInAsEmail,
    userPubkey,
    keyMismatchAction,
    verifyUserKey,
    updateMe,
    verifyUserKeyError,
    onVerifyUserKey
  } = useVerifyKey();

  useEffect(() => {
    const { verificationtoken } = qs.parse(location.search);
    if (
      isEmpty(location.search) ||
      !verificationtoken ||
      typeof verificationtoken !== "string"
    ) {
      history.push("/user/login");
    }
    if (loggedInAsEmail && verificationtoken) {
      onVerifyUserKey(loggedInAsEmail, verificationtoken);
    }
  });

  useEffect(() => {
    if (loggedInAsEmail) {
      const { verificationtoken } = qs.parse(location.search);
      onVerifyUserKey(loggedInAsEmail, verificationtoken);
    }
    if (
      verifyUserKey &&
      verifyUserKey.success &&
      apiMeResponse &&
      loggedInAsEmail
    ) {
      verifyUserPubkey(loggedInAsEmail, userPubkey, keyMismatchAction);
      pki.myPubKeyHex(loggedInAsEmail).then(pubkey => {
        if (pubkey !== apiMeResponse.publickey) {
          updateMe({
            apiMeResponse,
            publickey: pubkey
          });
        }
      });
    }
  });

  return (
    <SingleContentPage>
      <div>
        {!verifyUserKey && !verifyUserKeyError && "Loading ..."}
        {verifyUserKeyError && (
          <Message kind="error">
            {verifyUserKeyError.message}
          </Message>
        )}
        {verifyUserKey && verifyUserKey.success && (
          <Message kind="success">
            {"You have verified and activated your new identity."}
          </Message>
        )}
      </div>
    </SingleContentPage>
  );
};

export default withRouter(VerifyKey);
