import { Button, Card, classNames, Message, Modal, P, Spinner, Text } from "pi-ui";
import React, { useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import DevelopmentOnlyContent from "src/componentsv2/DevelopmentOnlyContent";
import ModalConfirm from "src/componentsv2/ModalConfirm";
import ModalImportIdentity from "src/componentsv2/ModalImportIdentity";
import PrivateKeyDownloadManager from "src/componentsv2/PrivateKeyDownloadManager";
import { PUB_KEY_STATUS_LOADING } from "src/constants";
import { verifyUserPubkey } from "src/helpers";
import useUserIdentity from "src/hooks/api/useUserIdentity";
import useBooleanState from "src/hooks/utils/useBooleanState";
import * as pki from "src/lib/pki";
import styles from "./Identity.module.css";
import IdentityList from "./IdentityList";

const fetchKeys = currentUserEmail =>
  pki
    .getKeys(currentUserEmail)
    .then(keys => JSON.stringify(keys, null, 2));

const Identity = ({ history, loadingKey, user}) => {
  const { userid, identities } = user; 
  const {
    currentUserID,
    currentUserEmail,
    userPubkey,
    identityImportSuccess,
    onUpdateUserKey,
    updateUserKey,
    keyMismatch,
    keyMismatchAction,
    shouldAutoVerifyKey
  } = useUserIdentity();
  const [
    showConfirmModal,
    openConfirmModal,
    closeConfirmModal
  ] = useBooleanState(false);
  const [
    showImportIdentityModal,
    openImportIdentityModal,
    closeImportIdentityModal
  ] = useBooleanState(false);
  const [
    showShowAllModal,
    openShowAllModal,
    closeShowAllModal
  ] = useBooleanState(false);
  useEffect(() => {
    verifyUserPubkey(currentUserEmail, userPubkey, keyMismatchAction);
  }, [currentUserEmail, userPubkey, keyMismatchAction]);

  const pastIdentities = identities && identities.filter(i => !i.isactive);
  const pubkey = identities && identities.filter(i => i.isactive)[0].pubkey;

  const updateKey = useCallback(async () => {
    try {
      await onUpdateUserKey(currentUserEmail);
    } catch (e) {
      throw e;
    }
  }, [onUpdateUserKey, currentUserEmail]);

  const [keyData, setKeyData] = useState();

  useEffect(() => {
    fetchKeys(currentUserEmail).then(keyData => {
      setKeyData(keyData);
    });
  }, [currentUserEmail]);

  const PublicKeyText = () => (pubkey || userPubkey) ? (
    <P className="margin-top-s margin-bottom-s">
      <Text backgroundColor="blueLighter" monospace>
        {pubkey || userPubkey}
      </Text>
    </P>
  ) : null;
  
  const isUserPageOwner = user && currentUserID === userid;

  return loadingKey === PUB_KEY_STATUS_LOADING ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
      <Card className="margin-bottom-m" paddingSize="small">
        <Text
          color="grayDark"
          weight="semibold"
          className={styles.fieldHeading}
        >
          Public key
        </Text>
        {isUserPageOwner ? (
          <>
            {shouldAutoVerifyKey &&
              updateUserKey &&
              updateUserKey.verificationtoken ? (
                <DevelopmentOnlyContent style={{ margin: "1rem 0 1rem 0" }} show>
                  <Button
                    type="button"
                    onClick={() =>
                      history.push(
                        `/user/key/verify?verificationtoken=${updateUserKey.verificationtoken}`
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
                    The public key on the Politeia server differs from the key on
                    your browser. This is usually caused from the local data on your
                    browser being cleared or by using a different browser.
                  </P>
                  <P className="margin-bottom-s">
                    You can fix this by importing your old identity, logging in with
                    the proper browser, or by creating a new identity (destroying
                    your old identity)
                  </P>
                </>
              ) : (
                <div
                  className={classNames(
                    styles.fieldHeading,
                    "margin-bottom-s",
                    "margin-top-s"
                  )}
                >
                  <P>
                    Your public and private keys constitute your identity. The private key
                    is used to sign your proposals, comments and any up/down votes on
                    Politeia. You can have only one identity active at a time. Your keys
                    are stored in your browser by default, so if you use Politeia on multiple
                    machines you will need to import your keys before you can participate.

                  </P>
                  <PublicKeyText />
                </div>
              )
            }
            <div className={styles.buttonsWrapper}>
              <Button size="sm" onClick={openConfirmModal}>
                Create new identity
            </Button>
              <Button size="sm" onClick={openImportIdentityModal}>
                Import identity
            </Button>
              <PrivateKeyDownloadManager keyData={keyData} />
            </div>
          </>
        ) : <PublicKeyText />}
        <Text
          color="grayDark"
          weight="semibold"
          className={classNames(
            styles.fieldHeading,
            "margin-bottom-s",
            "margin-top-l"
          )}
        >
          Past public keys
      </Text>
        <P>
          {pastIdentities.length !== 0 ?
            "List of inactive public keys your account has had in the past."
            :
            "This account only had one active public key until now."
          }
        </P>
        {pastIdentities.length !== 0 && (
          <Button
            size="sm"
            kind="primary"
            onClick={openShowAllModal}
          >
            Show all
          </Button>
        )}
        <Text
          color="grayDark"
          weight="semibold"
          className={classNames(
            styles.fieldHeading,
            "margin-bottom-s",
            "margin-top-l"
          )}
        >
          User ID
      </Text>
        <P className="margin-bottom-s">
          Unique 16-byte UUID, as defined in <a href="http://tools.ietf.org/html/rfc4122">
            RFC 4122</a>, used to identify your user.
      </P>
        <Text backgroundColor="blueLighter" monospace>
          {userid}
        </Text>
        <ModalConfirm
          title="Create new identity"
          message="Are you sure you want to generate a new identity?"
          show={showConfirmModal}
          onClose={closeConfirmModal}
          onSubmit={updateKey}
          successTitle="Create new identity"
          successMessage={`Your new identity has been requested, please check your email at ${currentUserEmail} to verify and activate it.

          The verification link needs to be open with the same browser that you used to generate this new identity.`}
        />
        <ModalImportIdentity
          show={showImportIdentityModal}
          onClose={closeImportIdentityModal}
        />
        <Modal
          show={showShowAllModal}
          onClose={closeShowAllModal}
          title="Past public keys"
        >
          <IdentityList full identities={pastIdentities} />
        </Modal>
      </Card>
    );
};

export default withRouter(Identity);
