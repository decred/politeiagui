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
import { convertAtomsToDcr } from "@politeiagui/common-ui/utils";
import { downloadCSV } from "@politeiagui/core/downloads";

import UserDetails from "./Details";
import styles from "./styles.module.css";
import {
  formatDataToTable,
  getCreditsTableData,
  getCreditsTableHeaders,
  getFeeTableData,
} from "./helpers";
// MOCK DATA
import { credits, paywall, registration, user } from "./_mock";

const CreditsBalanceAndFee = ({
  isPaid,
  unspentCredits,
  creditPriceDCR,
  feePriceDCR,
}) => {
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
            Politeia requires a small registration fee of {feePriceDCR} DCR
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
            {creditPriceDCR} DCR
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

const PaymentsHistory = ({
  credits,
  creditPriceDCR,
  feePriceDCR,
  feeTx,
  feeTimestamp,
  username,
}) => {
  const creditsData = getCreditsTableData(credits, creditPriceDCR);
  const feeData = getFeeTableData({
    feePriceDCR,
    timestamp: feeTimestamp,
    txid: feeTx,
  });

  const headers = getCreditsTableHeaders();
  const data = [...creditsData, feeData];

  const formattedData = formatDataToTable(data);

  function handleDownload() {
    downloadCSV(data, headers, `${username}-payments`, { datePrefix: true });
  }
  return (
    <>
      <Card className={styles.userCard}>
        <div className={styles.horizontalSection}>
          <Text color="gray" weight="semibold">
            Payments History
          </Text>
          <ButtonIcon
            // TODO: onClick and download csv data from credits table
            type="down"
            text="Export to .csv"
            iconBackgroundColor="#8997a5"
            iconColor="#ffffff"
            onClick={handleDownload}
          />
        </div>
        <Table
          bodyCellClassName={styles.tableCell}
          data={formattedData}
          headers={headers}
        />
      </Card>
    </>
  );
};

function UserCredits() {
  const isPaid = registration.haspaid;
  const unspentCredits = credits.unspentcredits.length;
  const creditPriceDCR = convertAtomsToDcr(paywall.creditprice);
  const feePriceDCR = convertAtomsToDcr(user.newuserpaywallamount);
  const feeTx = user.newuserpaywalltx;
  const feeTimestamp = user.newuserpaywalltxnotbefore;
  const username = user.username;

  return (
    <UserDetails tab="Credits">
      <CreditsBalanceAndFee
        isPaid={isPaid}
        unspentCredits={unspentCredits}
        creditPriceDCR={creditPriceDCR}
        feePriceDCR={feePriceDCR}
      />
      <PaymentsHistory
        username={username}
        creditPriceDCR={creditPriceDCR}
        credits={[...credits.spentcredits, ...credits.unspentcredits]}
        feePriceDCR={feePriceDCR}
        feeTimestamp={feeTimestamp}
        feeTx={feeTx}
      />
    </UserDetails>
  );
}

export default UserCredits;
