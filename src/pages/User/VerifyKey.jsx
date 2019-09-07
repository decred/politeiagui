import { Message } from "pi-ui";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import SingleContentPage from "src/componentsv2/layout/SingleContentPage";
import { verifyUserPubkey } from "src/helpers";
import useVerifyKey from "src/hooks/api/useVerifyKey";
import * as pki from "src/lib/pki";

const VerifyKey = ({ location }) => {
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

  const [keyUpdated, setKeyUpdated] = useState(false);

  useEffect(() => {
    if (loggedInAsEmail && !keyUpdated) {
      const { verificationtoken } = qs.parse(location.search);
      onVerifyUserKey(loggedInAsEmail, verificationtoken);
    }
  }, [loggedInAsEmail, location, onVerifyUserKey, keyUpdated]);

  useEffect(() => {
    if (
      verifyUserKey &&
      verifyUserKey.success &&
      apiMeResponse &&
      loggedInAsEmail &&
      !keyUpdated
    ) {
      verifyUserPubkey(loggedInAsEmail, userPubkey, keyMismatchAction);
      pki.myPubKeyHex(loggedInAsEmail).then(pubkey => {
        setKeyUpdated(true);
        updateMe({
          ...apiMeResponse,
          publickey: pubkey
        });
      });
    }
  }, [verifyUserKey, loggedInAsEmail, apiMeResponse, userPubkey, keyMismatchAction, updateMe, keyUpdated]);

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
