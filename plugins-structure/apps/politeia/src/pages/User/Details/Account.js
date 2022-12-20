import React from "react";
import { Button, Text } from "pi-ui";
import {
  AccountClearDataModal,
  AccountPasswordChangeModal,
  LabelValueList,
  ModalConfirmWithReason,
  useModal,
} from "@politeiagui/common-ui";
import {
  convertAtomsToDcr,
  formatUnixTimestamp,
} from "@politeiagui/common-ui/utils";
import UserDetails from "./Details";

import { InfoCard } from "../../../components";

import styles from "./styles.module.css";
import { formatItemsList } from "./helpers";

import { user } from "./_mock";

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

function UserAccount() {
  const [open] = useModal();
  function handleChangePassword() {
    open(AccountPasswordChangeModal, {
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
      onSubmit: (values) => {
        console.log("Deactivating account", values);
      },
      successMessage: "Account Deactivated. You'll be logged out.",
    });
  }

  const accountItems = [
    { label: "Admin", value: user.isadmin },
    { label: "Verified Email", value: !user.newuserverificationtoken },
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
    <UserDetails>
      <InfoCard title="Account Details">
        <LabelValueList alignValues items={formatItemsList(accountItems)} />
      </InfoCard>
      <InfoCard title="Paywall">
        <LabelValueList alignValues items={formatItemsList(paywallItems)} />
      </InfoCard>
      <InfoCard title="Security">
        <LabelValueList alignValues items={formatItemsList(securityItems)} />
        <Button size="sm" onClick={handleDeactivate}>
          Deactivate Account
        </Button>
      </InfoCard>
    </UserDetails>
  );
}

export default UserAccount;
