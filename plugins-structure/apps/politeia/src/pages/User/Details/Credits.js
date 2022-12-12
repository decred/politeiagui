import React from "react";
import {
  Button,
  ButtonIcon,
  Card,
  Column,
  Row,
  StatusTag,
  Table,
  Text,
} from "pi-ui";
import UserDetails from "./Details";
import styles from "./styles.module.css";
import { getCreditsTableData, getCreditsTableHeaders } from "./helpers";
// MOCK DATA
import { credits, registration } from "./_mock";

const CreditsAndFee = ({ isPaid, unspentCredits }) => {
  const statusTagProps = isPaid
    ? { text: "Paid", type: "greenCheck" }
    : { text: "Not Paid", type: "grayNegative" };
  return (
    <Card className={styles.userCard}>
      <Row>
        <Column xs={12} md={6} className={styles.column}>
          <Text color="gray" weight="semibold">
            Registration Fee
          </Text>
          <StatusTag {...statusTagProps} />
          <Text size="small" color="gray">
            Politeia requires a small registration fee of exactly 0.1 DCR.
          </Text>
          {/* TODO: onClick */}
          {!isPaid && <Button size="sm">Pay Registration Fee</Button>}
        </Column>
        <Column xs={12} md={6} className={styles.column}>
          <Text color="gray" weight="semibold">
            Proposal Credits
          </Text>
          <Text weight="bold">{unspentCredits || 0}</Text>
          <Text size="small" color="gray">
            Each proposal submission requires 1 proposal credit which costs{" "}
            exactly 0.1 DCR.
          </Text>
          <div>
            {/* TODO: onClick */}
            <Button size="sm">Purchase More</Button>
            <Button size="sm">Rescan</Button>
          </div>
        </Column>
      </Row>
    </Card>
  );
};

const CreditsHistory = ({ credits }) => {
  const data = getCreditsTableData(credits);
  return (
    <>
      <Card className={styles.userCard}>
        <div className={styles.horizontalSection}>
          <Text color="gray" weight="semibold">
            Credit History
          </Text>
          <ButtonIcon
            // TODO: onClick and download csv data from credits table
            type="down"
            text="Export to .csv"
            iconBackgroundColor="#8997a5"
            iconColor="#ffffff"
          />
        </div>
        <Table data={data} headers={getCreditsTableHeaders()} />
      </Card>
    </>
  );
};

function UserCredits() {
  const isPaid = registration.haspaid;
  const unspentCredits = credits.unspentcredits.length;

  return (
    <UserDetails tab="Credits">
      <CreditsAndFee isPaid={isPaid} unspentCredits={unspentCredits} />
      <CreditsHistory
        credits={[...credits.spentcredits, ...credits.unspentcredits]}
      />
    </UserDetails>
  );
}

export default UserCredits;
