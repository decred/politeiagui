import React from "react";
import { Button, Card, Text } from "pi-ui";
import { LabelValueList } from "@politeiagui/common-ui";
import {
  convertAtomsToDcr,
  formatUnixTimestamp,
} from "@politeiagui/common-ui/utils";
import UserDetails from "./Details";
import styles from "./styles.module.css";

import isEmpty from "lodash/isEmpty";
import isBoolean from "lodash/isBoolean";

import { user } from "./_mock";

function formatItemValue(value) {
  return isBoolean(value) ? (
    value ? (
      "Yes"
    ) : (
      "No"
    )
  ) : isEmpty(value) ? (
    <Text color="gray">No information provided</Text>
  ) : (
    value
  );
}

function formatItemsList(items) {
  return items.map(({ label, value }) => ({
    label,
    value: formatItemValue(value),
  }));
}

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
  const accountItems = [
    { label: "Admin", value: user.isadmin },
    { label: "Verified Email", value: !user.newuserverificationtoken },
    { label: "Password", value: <Button size="sm">Change Password</Button> },
    { label: "Personal Data", value: <PersonalData onClear={() => {}} /> },
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
    <UserDetails tab="Account">
      <Card paddingSize="small" className={styles.userCard}>
        <div>
          <Text weight="semibold" color="grayDark">
            Account Details
          </Text>
          <LabelValueList alignValues items={formatItemsList(accountItems)} />
        </div>
        <div>
          <Text weight="semibold" color="grayDark">
            Paywall
          </Text>
          <LabelValueList alignValues items={formatItemsList(paywallItems)} />
        </div>
        <div>
          <Text weight="semibold" color="grayDark">
            Security
          </Text>
          <LabelValueList alignValues items={formatItemsList(securityItems)} />
          <Button size="sm">Deactivate Account</Button>
        </div>
      </Card>
    </UserDetails>
  );
}

export default UserAccount;
