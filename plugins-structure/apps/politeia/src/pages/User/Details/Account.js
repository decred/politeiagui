import React from "react";
import { Button, ButtonIcon, Text } from "pi-ui";
import {
  AccountClearDataModal,
  AccountPasswordChangeModal,
  AccountUsernameChangeModal,
  LabelValueList,
  ModalConfirmWithReason,
  useModal,
} from "@politeiagui/common-ui";
import {
  convertAtomsToDcr,
  formatUnixTimestamp,
} from "@politeiagui/common-ui/utils";
import { InfoCard } from "../../../components";
import styles from "./styles.module.css";
import { formatItemsList } from "./helpers";

import { buildRegexFromSupportedChars } from "../../../pi/policy/utils";
import { useSelector } from "react-redux";
import { users } from "@politeiagui/core/user/users";
import { userAuth } from "@politeiagui/core/user/auth";
import { apiPolicy } from "@politeiagui/core/api";

/**
 * PersonalData component defines the personal data section of the user account
 * items list.
 */
const PersonalData = ({ onClear }) => (
  <div className={styles.section}>
    <Text color="gray">
      You can clear all of your user data stored in the browser, including your
      identity and draft records. Make a backup copy of your identity key if you
      are choosing to do so. You will be logged out after doing this.
    </Text>
    <div>
      <Button size="sm" onClick={onClear}>
        Clear Data
      </Button>
    </div>
  </div>
);

/**
 * Username component defines the username section of the user account items
 * list. If user is the owner of the account, it will render an edit button.
 */
const Username = ({ username, isOwner }) => {
  const [open] = useModal();
  const { usernamesupportedchars } = useSelector(apiPolicy.select);
  function handleEditUsername() {
    open(AccountUsernameChangeModal, {
      usernameValidationRegex: buildRegexFromSupportedChars(
        usernamesupportedchars
      ),
      onSubmit: (values) => {
        console.log("Edit user", values);
      },
    });
  }
  return (
    <div className={styles.horizontalSection}>
      <span>{username}</span>
      {isOwner && (
        <ButtonIcon
          type="edit"
          onClick={handleEditUsername}
          data-testid="user-account-username-edit-button"
        />
      )}
    </div>
  );
};

/**
 * PaywallItems component defines the paywall section. It will render the
 * paywall address, amount and pay after date.
 */
const PaywallItems = ({ user }) => {
  const paywallItems = [
    { label: "Address", value: user.newuserpaywalladdress },
    {
      label: "Amount",
      value: `${convertAtomsToDcr(user.newuserpaywallamount)} DCR`,
    },
    {
      label: "Pay after",
      value: formatUnixTimestamp(user.newuserpaywalltxnotbefore),
    },
  ];
  return (
    <InfoCard title="Paywall" data-testid="user-account-paywall">
      <LabelValueList alignValues items={formatItemsList(paywallItems)} />
    </InfoCard>
  );
};

/**
 * SecurityItems component defines the security section. It will render the
 * failed login attempts and locked status, as well as a button to deactivate
 * the account if the user is the owner of the account.
 */
const SecurityItems = ({ user }) => {
  const [open] = useModal();
  const securityItems = [
    { label: "Failed login attempts", value: user.failedloginattempts },
    { label: "Locked", value: user.islocked },
  ];
  function handleDeactivate() {
    open(ModalConfirmWithReason, {
      title: "Account Deactivation",
      message:
        "You are about to deactivate your account. Please, provide a reason for this action.",
      onSubmit: (values) => {
        console.log("Deactivating account", values);
      },
      successMessage: "Account Deactivated. You'll be logged out.",
    });
  }
  return (
    <InfoCard title="Security" data-testid="user-account-security">
      <LabelValueList alignValues items={formatItemsList(securityItems)} />
      <Button size="sm" onClick={handleDeactivate}>
        Deactivate Account
      </Button>
    </InfoCard>
  );
};

/**
 * AccountItems component defines the account section. It will render the
 * username, email, verified email, admin status, password and clear data
 * sections. Admins will be able to see all the information, while regular
 * users will only see their own information. If user is neither admin nor
 * the owner of the account, only show username and admin status.
 */
const AccountItems = ({ user, isOwner, isAdmin }) => {
  const [open] = useModal();
  const { minpasswordlength } = useSelector(apiPolicy.select);
  function handleChangePassword() {
    open(AccountPasswordChangeModal, {
      minpasswordlength: minpasswordlength,
      onSubmit: (values) => {
        console.log("Password Changed", values);
      },
    });
  }
  function handleClearData() {
    open(AccountClearDataModal, {
      onSubmit: () => {
        console.log("Data Cleared");
      },
    });
  }

  const hidePublic = !isAdmin && !isOwner;
  const accountItems = [
    {
      label: "Username",
      value: <Username username={user.username} isOwner={isOwner} />,
    },
    { label: "E-mail", value: user.email, hide: hidePublic },
    {
      label: "Verified Email",
      value: !user.newuserverificationtoken,
      hide: hidePublic,
    },
    { label: "Admin", value: user.isadmin },
    {
      label: "Password",
      value: (
        <Button size="sm" onClick={handleChangePassword}>
          Change Password
        </Button>
      ),
      hide: !isOwner,
    },
    {
      label: "Personal Data",
      value: <PersonalData onClear={handleClearData} />,
      hide: !isOwner,
    },
  ];
  return (
    <InfoCard title="Account Details" data-testid="user-account-details">
      <LabelValueList alignValues items={formatItemsList(accountItems)} />
    </InfoCard>
  );
};

function UserAccount({ userid }) {
  const user = useSelector((state) => users.selectById(state, userid));
  const currentUser = useSelector(userAuth.selectCurrent);
  const isOwner = currentUser && currentUser.userid === userid;
  const isAdmin = currentUser && currentUser.isadmin;

  return (
    <>
      <AccountItems user={user} isOwner={isOwner} isAdmin={isAdmin} />
      {(isOwner || isAdmin) && <PaywallItems user={user} />}
      {(isOwner || isAdmin) && <SecurityItems user={user} />}
    </>
  );
}

export default UserAccount;
