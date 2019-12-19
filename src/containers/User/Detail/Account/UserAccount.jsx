import { Card, classNames } from "pi-ui";
import React from "react";
import useBooleanState from "src/hooks/utils/useBooleanState";
import useChangePassword from "../hooks/useChangePassword";
import ModalChangePassword from "src/componentsv2/ModalChangePassword";
import AdminSection from "./components/AdminSection";
import AddressSection from "./components/AddressSection";
import EmailSection from "./components/EmailSection";
import PasswordSection from "./components/PasswordSection";
import PaywallSection from "./components/PaywallSection";

const UserAccount = ({
  newuserverificationtoken,
  newuserpaywalladdress,
  newuserpaywallamount,
  newuserpaywalltxnotbefore,
  isadmin // from the user API return
}) => {
  const [
    showPasswordModal,
    openPasswordModal,
    closePasswordModal
  ] = useBooleanState(false);

  const {
    onChangePassword,
    validationSchema: changePasswordValidationSchema
  } = useChangePassword();

  return (
    <Card className={classNames("container", "margin-bottom-m")}>
      <AdminSection isadmin={isadmin} />
      <EmailSection token={newuserverificationtoken} />
      <PasswordSection onClick={openPasswordModal} />
      <AddressSection address={newuserpaywalladdress} />
      <PaywallSection
        amount={newuserpaywallamount}
        timestamp={newuserpaywalltxnotbefore}
      />
      <ModalChangePassword
        onChangePassword={onChangePassword}
        validationSchema={changePasswordValidationSchema}
        show={showPasswordModal}
        onClose={closePasswordModal}
      />
    </Card>
  );
};

export default UserAccount;
