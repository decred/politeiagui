import React, { useCallback, useState } from "react";
import { Modal, Button, P, Icon, Message } from "pi-ui";
import useNavigation from "src/hooks/api/useNavigation";

const ModalLogout = ({ show, onClose }) => {
  const { onLogout, isCMS } = useNavigation();
  const [error, setError] = useState();

  const onLogoutClick = useCallback(async () => {
    try {
      await onLogout(isCMS, false);
      onClose();
    } catch (err) {
      setError(err);
    }
  }, [onLogout, onClose, isCMS]);

  const onPermanentLogoutClick = useCallback(() => {
    onLogout(isCMS, true);
    onClose();
  }, [onLogout, onClose, isCMS]);

  return (
    <Modal
      show={show}
      title="Logout"
      onClose={onClose}
      iconComponent={<Icon type={"info"} size={26} />}>
      {error && (
        <Message kind="error" className="margin-top-m margin-bottom-m">
          {error.toString()}
        </Message>
      )}
      <P>
        A normal logout keeps your data saved in the browser. A permanent logout
        will clear all of your user data stored in the browser, including your
        identity and draft records. Make a backup copy of your identity key if
        you are choosing to clear your data.
      </P>
      <div className="justify-right margin-top-m">
        <Button onClick={onLogoutClick} data-testid="logout-btn">Logout</Button>
        <Button kind="secondary" onClick={onPermanentLogoutClick}>
          Logout permanently
        </Button>
      </div>
    </Modal>
  );
};

export default ModalLogout;
