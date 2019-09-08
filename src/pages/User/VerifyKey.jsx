import { Message } from "pi-ui";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
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

  const verifyAndUpdateLocalKey = useCallback(async () => {
    try {
      const { verificationtoken } = qs.parse(location.search);
      if (verificationtoken && loggedInAsEmail) {
        await onVerifyUserKey(loggedInAsEmail, verificationtoken);
        verifyUserPubkey(loggedInAsEmail, userPubkey, keyMismatchAction);
        pki.myPubKeyHex(loggedInAsEmail).then(pubkey => {
          updateMe({
            ...apiMeResponse,
            publickey: pubkey
          });
        });
        setKeyUpdated(true);
      }
    } catch (e) {
      setKeyUpdated(true);
      throw e;
    }
  }, [loggedInAsEmail, apiMeResponse, userPubkey, keyMismatchAction, updateMe, onVerifyUserKey, location]);

  useEffect(() => {
    if (!keyUpdated) {
      verifyAndUpdateLocalKey();
    }
  }, [verifyAndUpdateLocalKey, keyUpdated]);

  const loading = !verifyUserKey && !verifyUserKeyError;

  const success = verifyUserKey && verifyUserKey.success;

  const error = verifyUserKeyError;

  return (
    <SingleContentPage>
      <div>
        {loading && "Loading ..."}
        {error && (
          <Message kind="error">
            {error.message}
          </Message>
        )}
        {success && (
          <Message kind="success">
            {"You have verified and activated your new identity."}
          </Message>
        )}
      </div>
    </SingleContentPage>
  );
};

export default withRouter(VerifyKey);
