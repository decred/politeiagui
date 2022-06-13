import React from "react";
import { Button, Text } from "pi-ui";
import useNavigation from "src/hooks/api/useNavigation";
import ModalConfirm from "src/components/ModalConfirm";
import InfoSection from "../../InfoSection.jsx";
import useModalContext from "src/hooks/utils/useModalContext";

export default () => {
  const { onLogout, isCMS } = useNavigation();
  const handlePermanentLogoutClick = () => onLogout(isCMS, true);
  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenModalConfirm = () => {
    handleOpenModal(ModalConfirm, {
      onClose: handleCloseModal,
      onSubmit: handlePermanentLogoutClick,
      title: "Clear user data"
    });
  };

  return (
    <>
      <InfoSection
        label="Personal data"
        info={
          <>
            <Text color="gray">
              You can clear all of your user data stored in the browser,
              including your identity and draft records. Make a backup copy of
              your identity key if you are choosing to do so. You will be logged
              out after doing this.
            </Text>
            <Button
              size="sm"
              className="margin-top-s margin-bottom-m"
              onClick={handleOpenModalConfirm}
            >
              Clear data
            </Button>
          </>
        }
      />
    </>
  );
};
