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

import { user } from "./_mock";
import { buildRegexFromSupportedChars } from "../../../pi/policy/utils";

const MIN_PASSWORD_LENGTH = 8;
const USERNAME_SUPPORTED_CHARS = [
  "a-z",
  "0-9",
  ".",
  ",",
  ":",
  ";",
  "-",
  "@",
  "+",
  "(",
  ")",
  "_",
];

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

const Username = ({ username, isOwner, onEdit }) => {
  return (
    <div className={styles.horizontalSection}>
      <span>{username}</span>
      {isOwner && (
        <ButtonIcon
          type="edit"
          onClick={onEdit}
          data-testid="user-account-username-edit-button"
        />
      )}
    </div>
  );
};

function UserAccount() {
  const [open] = useModal();
  function handleChangePassword() {
    open(AccountPasswordChangeModal, {
      minpasswordlength: MIN_PASSWORD_LENGTH,
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
  function handleEditUsername() {
    open(AccountUsernameChangeModal, {
      usernameValidationRegex: buildRegexFromSupportedChars(
        USERNAME_SUPPORTED_CHARS
      ),
      onSubmit: (values) => {
        console.log("Edit user", values);
      },
    });
  }

  const accountItems = [
    {
      label: "Username",
      value: (
        <Username
          username={user.username}
          isOwner
          onEdit={handleEditUsername}
        />
      ),
    },
    { label: "E-mail", value: user.email },
    { label: "Verified Email", value: !user.newuserverificationtoken },
    { label: "Admin", value: user.isadmin },
    {
      label: "Password",
      value: (
        <Button size="sm" onClick={handleChangePassword}>
          Change Password
        </Button>
      ),
    },
    {
      label: "Personal Data",
      value: <PersonalData onClear={handleClearData} />,
    },
  ];
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
  const securityItems = [
    { label: "Failed login attempts", value: user.failedloginattempts },
    { label: "Locked", value: user.islocked },
  ];

  return (
    <>
      <InfoCard title="Account Details" data-testid="user-account-details">
        <LabelValueList alignValues items={formatItemsList(accountItems)} />
      </InfoCard>
      <InfoCard title="Paywall" data-testid="user-account-paywall">
        <LabelValueList alignValues items={formatItemsList(paywallItems)} />
      </InfoCard>
      <InfoCard title="Security" data-testid="user-account-security">
        <LabelValueList alignValues items={formatItemsList(securityItems)} />
        <Button size="sm" onClick={handleDeactivate}>
          Deactivate Account
        </Button>
      </InfoCard>
    </>
  );
}

export default UserAccount;
