import { Card, Spinner, Text } from "pi-ui";
import React, { useEffect } from "react";
import { PUB_KEY_STATUS_LOADING } from "src/constants";
import { verifyUserPubkey } from "src/helpers";
import useUserIdentity from "src/hooks/api/useUserIdentity";
import styles from "./Identity.module.css";
import PublicKeyText from "./components/PublicKeyText";
import PastKeysSection from "./components/PastKeysSection";
import UserIdSection from "./components/UserIdSection";

const OtherIdentity = ({ loadingKey, id: userID, identities }) => {
  const {
    loggedInAsEmail,
    userPubkey,
    keyMismatchAction
  } = useUserIdentity();

  useEffect(() => {
    verifyUserPubkey(loggedInAsEmail, userPubkey, keyMismatchAction);
  }, [loggedInAsEmail, userPubkey, keyMismatchAction]);

  const activeIdentity = identities.filter(i => i.isactive)[0];
  const pubkey = activeIdentity && activeIdentity.pubkey;

  const pastIdentities = identities.filter(i => !i.isactive);

  return loadingKey === PUB_KEY_STATUS_LOADING ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Card className="margin-bottom-m" paddingSize="small">
      <Text color="grayDark" weight="semibold" className={styles.fieldHeading}>
        Public key
      </Text>
      <PublicKeyText pubkey={pubkey} />
      <PastKeysSection pastIdentities={pastIdentities} />
      <UserIdSection id={userID} />
    </Card>
  );
};

export default OtherIdentity;
