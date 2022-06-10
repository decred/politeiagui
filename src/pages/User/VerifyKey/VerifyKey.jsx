import { Button, classNames, Icon, Text } from "pi-ui";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import SingleContentPage from "src/components/layout/SingleContentPage";
import { verifyUserPubkey } from "src/helpers";
import useVerifyKey from "src/hooks/api/useVerifyKey";
import styles from "./VerifyKey.module.css";

const VerifyKey = ({ location, history }) => {
  const {
    currentUserID,
    userPubkey,
    keyMismatchAction,
    verifyUserKey,
    verifyUserKeyError,
    onVerifyUserKey,
    isCMS
  } = useVerifyKey();

  const [keyUpdated, setKeyUpdated] = useState(false);

  const verifyAndUpdateLocalKey = useCallback(async () => {
    try {
      const { verificationtoken } = qs.parse(location.search);
      if (verificationtoken && currentUserID) {
        await onVerifyUserKey(currentUserID, verificationtoken);
        verifyUserPubkey(currentUserID, userPubkey, keyMismatchAction);
        setKeyUpdated(true);
      }
    } catch (e) {
      setKeyUpdated(true);
      throw e;
    }
  }, [currentUserID, userPubkey, keyMismatchAction, onVerifyUserKey, location]);

  useEffect(() => {
    if (!keyUpdated && !verifyUserKey) {
      verifyAndUpdateLocalKey();
    }
  }, [verifyAndUpdateLocalKey, keyUpdated, verifyUserKey]);

  const loading = !verifyUserKey && !verifyUserKeyError;
  const success = verifyUserKey && verifyUserKey.success;
  const error = verifyUserKeyError;
  const pushToHome = useCallback(() => history.push("/"), [history]);
  const successButtonText = isCMS
    ? "Ok, go to invoices"
    : "Ok, go to proposals";

  return (
    <SingleContentPage>
      <div>
        {loading && "Loading ..."}
        {error && (
          <div className={styles.container}>
            <div className={styles.iconAndTextWrapper}>
              <div className={styles.iconWrapper}>
                <Icon
                  type="alert"
                  size="xlg"
                  backgroundColor="#ed6d47"
                  iconColor="white"
                />
              </div>
              <Text className="margin-left-s">{error.message}</Text>
            </div>
            <Button
              className={classNames("margin-top-l", styles.btn)}
              onClick={pushToHome}
              type="button"
            >
              Ok, go to home
            </Button>
          </div>
        )}
        {success && (
          <div className={styles.container}>
            <div className={styles.iconAndTextWrapper}>
              <Icon
                type="checkmark"
                size="xlg"
                backgroundColor="#41bf53"
                iconColor="white"
              />
              <Text className="margin-left-s">
                You have verified and activated your new identity.
              </Text>
            </div>
            <Button
              className={classNames("margin-top-l", styles.btn)}
              onClick={pushToHome}
              type="button"
            >
              {successButtonText}
            </Button>
          </div>
        )}
      </div>
    </SingleContentPage>
  );
};

export default withRouter(VerifyKey);
