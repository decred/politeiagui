import { Card, classNames } from "pi-ui";
import React from "react";
import useChangePassword from "../hooks/useChangePassword";
import ModalChangePassword from "src/components/ModalChangePassword";
import AdminSection from "./components/AdminSection";
import AddressSection from "./components/AddressSection";
import EmailSection from "./components/EmailSection";
import PasswordSection from "./components/PasswordSection";
import PaywallSection from "./components/PaywallSection";
import UserDataSection from "./components/UserDataSection";
import { useConfig } from "src/containers/Config";
import useModalContext from "src/hooks/utils/useModalContext";

const UserAccount = ({
  newuserverificationtoken,
  newuserpaywalladdress,
  newuserpaywallamount,
  newuserpaywalltxnotbefore,
  isadmin // from the user API return
}) => {
  const { enablePaywall } = useConfig();

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const { onChangePassword, validationSchema: changePasswordValidationSchema } =
    useChangePassword();

  const handleChangePasswordModal = () => {
    handleOpenModal(ModalChangePassword, {
      onChangePassword: onChangePassword,
      validationSchema: changePasswordValidationSchema,
      onClose: handleCloseModal
    });
  };

  return (
    <Card className={classNames("container", "margin-bottom-m")}>
      <AdminSection isadmin={isadmin} />
      <EmailSection token={newuserverificationtoken} />
      <PasswordSection onClick={handleChangePasswordModal} />
      <UserDataSection />
      {enablePaywall && (
        <>
          <AddressSection address={newuserpaywalladdress} />
          <PaywallSection
            amount={newuserpaywallamount}
            timestamp={newuserpaywalltxnotbefore}
          />
        </>
      )}
    </Card>
  );
};

export default UserAccount;
