import { Button, Card, classNames, Message, P, Spinner, Text } from "pi-ui";
import React, { useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import DevelopmentOnlyContent from "src/components/DevelopmentOnlyContent";
import ModalConfirm from "src/components/ModalConfirm";
import ModalImportIdentity from "src/components/ModalImportIdentity";
import PrivateKeyDownloadManager from "src/components/PrivateKeyDownloadManager";
import { PUB_KEY_STATUS_LOADING } from "src/constants";
import { verifyUserPubkey } from "src/helpers";
import useUserIdentity from "src/hooks/api/useUserIdentity";
import * as pki from "src/lib/pki";
import styles from "./Identity.module.css";
import PublicKeyText from "./components/PublicKeyText";
import PastKeysSection from "./components/PastKeysSection";
import UserIdSection from "./components/UserIdSection";
import useModalContext from "src/hooks/utils/useModalContext";

const fetchKeys = (currentUserID) =>
  pki.getKeys(currentUserID).then((keys) => JSON.stringify(keys, null, 2));

const Identity = ({ history, loadingKey, user }) => {
  const { userid: userID, identities } = user;
  const {
    currentUserEmail,
    currentUserID,
    userPubkey,
    identityImportSuccess,
    onUpdateUserKey,
    updateUserKeyToken,
    keyMismatch,
    keyMismatchAction,
    shouldAutoVerifyKey
  } = useUserIdentity();

  useEffect(() => {
    verifyUserPubkey(currentUserID, userPubkey, keyMismatchAction);
  }, [currentUserID, userPubkey, keyMismatchAction]);

  const activeIdentity = identities && identities.filter((i) => i.isactive)[0];
  const pubkey = activeIdentity && activeIdentity.pubkey;

  const pastIdentities = identities && identities.filter((i) => !i.isactive);

  const updateKey = useCallback(async () => {
    await onUpdateUserKey(currentUserID);
  }, [onUpdateUserKey, currentUserID]);

  const [keyData, setKeyData] = useState();

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenCreateNewIdentityModal = () => {
    handleOpenModal(ModalConfirm, {
      title: "Create new identity",
      message: "Are you sure you want to generate a new identity?",
      onClose: handleCloseModal,
      onSubmit: updateKey,
      successTitle: "Create new identity",
      successMessage: `Your new identity has been requested, please check your email at ${currentUserEmail} to verify and activate it.

      The verification link needs to be open with the same browser that you used to generate this new identity.`
    });
  };

  const handleOpenImportIdentityModal = () => {
    handleOpenModal(ModalImportIdentity, {
      onClose: handleCloseModal
    });
  };

  useEffect(() => {
    let isSubscribed = true;
    fetchKeys(currentUserID).then((keyData) => {
      if (isSubscribed) setKeyData(keyData);
    });
    return () => (isSubscribed = false);
  }, [currentUserID]);

  return loadingKey === PUB_KEY_STATUS_LOADING ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Card className="margin-bottom-m" paddingSize="small">
      <Text
        weight="semibold"
        className={classNames(styles.fieldHeading, styles.block)}
      >
        Public key
      </Text>
      {shouldAutoVerifyKey && updateUserKeyToken ? (
        <DevelopmentOnlyContent style={{ margin: "1rem 0 1rem 0" }} show>
          <Button
            type="button"
            onClick={() =>
              history.push(
                `/user/key/verify?verificationtoken=${updateUserKeyToken}`
              )
            }
          >
            Auto verify key
          </Button>
        </DevelopmentOnlyContent>
      ) : keyMismatch && !identityImportSuccess ? (
        <>
          <Message className="margin-top-s" kind="error">
            Your key is invalid or inexistent. Please create/import one.
          </Message>
          <P className="margin-top-s">
            The public key on the Politeia server differs from the key on your
            browser. This is usually caused from the local data on your browser
            being cleared or by using a different browser.
          </P>
          <P className="margin-bottom-s">
            You can fix this by importing your old identity, logging in with the
            proper browser, or by creating a new identity (destroying your old
            identity)
          </P>
        </>
      ) : (
        <div
          className={classNames(
            styles.block,
            "margin-bottom-s",
            "margin-top-s"
          )}
        >
          <P>
            Your public and private keys constitute your identity. The private
            key is used to sign your proposals, comments and any up/down votes
            on Politeia. You can have only one identity active at a time. Your
            keys are stored in your browser by default, so if you use Politeia
            on multiple machines you will need to import your keys before you
            can participate.
          </P>
          <PublicKeyText pubkey={pubkey} />
        </div>
      )}
      <div className={styles.buttonsWrapper}>
        <Button size="sm" onClick={handleOpenCreateNewIdentityModal}>
          Create new identity
        </Button>
        <Button size="sm" onClick={handleOpenImportIdentityModal}>
          Import identity
        </Button>
        <PrivateKeyDownloadManager keyData={keyData} />
      </div>
      <PastKeysSection pastIdentities={pastIdentities} />
      <UserIdSection id={userID} />
    </Card>
  );
};

export default withRouter(Identity);
