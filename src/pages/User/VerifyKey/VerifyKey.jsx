import { Button, classNames, Icon, Text } from "pi-ui";
import qs from "query-string";
import React, { useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import SingleContentPage from "src/componentsv2/layout/SingleContentPage";
import { verifyUserPubkey } from "src/helpers";
import useVerifyKey from "src/hooks/api/useVerifyKey";
import styles from "./VerifyKey.module.css";

const VerifyKey = ({ location, history }) => {
  const {
    currentUserEmail,
    userPubkey,
    keyMismatchAction,
    verifyUserKey,
    verifyUserKeyError,
    onVerifyUserKey
  } = useVerifyKey();

  const [keyUpdated, setKeyUpdated] = useState(false);

  const verifyAndUpdateLocalKey = useCallback(async () => {
    try {
      const { verificationtoken } = qs.parse(location.search);
      if (verificationtoken && currentUserEmail) {
        await onVerifyUserKey(currentUserEmail, verificationtoken);
        verifyUserPubkey(currentUserEmail, userPubkey, keyMismatchAction);
        setKeyUpdated(true);
      }
    } catch (e) {
      setKeyUpdated(true);
      throw e;
    }
  }, [currentUserEmail, userPubkey, keyMismatchAction, onVerifyUserKey, location]);

  useEffect(() => {
    if (!keyUpdated && !verifyUserKey) {
      verifyAndUpdateLocalKey();
    }
  }, [verifyAndUpdateLocalKey, keyUpdated]);

  const loading = !verifyUserKey && !verifyUserKeyError;
  const success = verifyUserKey && verifyUserKey.success;
  const error = verifyUserKeyError;
  const pushToHome = useCallback(() => history.push("/"), [history]);

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
            <Text className="margin-left-s">
              {error.message}
            </Text>
          </div>
          <Button className={classNames("margin-top-l", styles.btn)} onClick={pushToHome} type="button">
            Ok, go to proposals
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
              <Text className="margin-left-s">You have verified and activated your new identity.</Text>
            </div>
            <Button className={classNames("margin-top-l", styles.btn)} onClick={pushToHome} type="button">
              Ok, go to proposals
            </Button>
          </div>
        )}
      </div>
    </SingleContentPage>
  );
};

export default withRouter(VerifyKey);
