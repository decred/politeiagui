import React, { useState } from "react";
import {
  Button,
  ButtonIcon,
  Column,
  H5,
  Row,
  StatusTag,
  Table,
  Text,
} from "pi-ui";
import {
  UserRegistrationFeeModal,
  useModal,
  useToast,
} from "@politeiagui/common-ui";
import { convertAtomsToDcr } from "@politeiagui/common-ui/utils";
import { downloadCSV } from "@politeiagui/core/downloads";
import { CreditsModal, InfoCard } from "../../../components";
import styles from "./styles.module.css";
import {
  formatDataToTable,
  getCreditsTableData,
  getCreditsTableHeaders,
  getFeeTableData,
} from "./helpers";
// MOCK DATA
import { credits, paywall, registration, user } from "./_mock";

function mockPaymentsScan() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

const CreditsBalanceAndFee = ({
  isPaid,
  unspentCredits,
  creditPriceDCR,
  feePriceDCR,
  address,
}) => {
  const [open] = useModal();
  const [isScanning, setIsScanning] = useState(false);
  const { openToast } = useToast();

  const statusTagProps = isPaid
    ? { text: "Paid", type: "greenCheck" }
    : { text: "Not Paid", type: "grayNegative" };

  function handlePayFee() {
    open(UserRegistrationFeeModal, { address });
  }
  function handlePurchaseCredits() {
    open(CreditsModal, { address });
  }
  function handleRescanPayments() {
    setIsScanning(true);
    mockPaymentsScan().then(() => {
      setIsScanning(false);
      openToast({
        title: "Payments Scan",
        body: "Payments scan completed!",
        kind: "success",
      });
    });
  }

  return (
    <InfoCard data-testid="user-credits-balance-fee">
      <Row>
        <Column xs={12} md={6} className={styles.column}>
          <H5>Registration Fee</H5>
          <StatusTag {...statusTagProps} />
          <Text size="small" color="gray">
            Politeia requires a small registration fee of {feePriceDCR} DCR
          </Text>
          {!isPaid && (
            <Button
              size="sm"
              onClick={handlePayFee}
              data-testid="user-credits-pay-fee-button"
            >
              Pay Registration Fee
            </Button>
          )}
        </Column>
        <Column xs={12} md={6} className={styles.column}>
          <H5>Proposal Credits</H5>
          <Text color="primaryDark" weight="bold">
            {unspentCredits || 0}
          </Text>
          <Text size="small" color="gray">
            Each proposal submission requires 1 proposal credit which costs{" "}
            {creditPriceDCR} DCR
          </Text>
          <div>
            <Button
              size="sm"
              onClick={handlePurchaseCredits}
              data-testid="user-credits-purchase-button"
            >
              Purchase More
            </Button>
            <Button
              size="sm"
              loading={isScanning}
              onClick={handleRescanPayments}
              data-testid="user-credits-rescan-button"
            >
              Rescan
            </Button>
          </div>
        </Column>
      </Row>
    </InfoCard>
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
      <InfoCard
        data-testid="user-credits-payments"
        title={
          <>
            Payments History
            <ButtonIcon
              type="down"
              text="Export to .csv"
              iconBackgroundColor="#8997a5"
              iconColor="#ffffff"
              onClick={handleDownload}
            />
          </>
        }
      >
        <Table
          bodyCellClassName={styles.tableCell}
          data={formattedData}
          headers={headers}
        />
      </InfoCard>
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
    <>
      <CreditsBalanceAndFee
        isPaid={isPaid}
        unspentCredits={unspentCredits}
        creditPriceDCR={creditPriceDCR}
        feePriceDCR={feePriceDCR}
        address={user.newuserpaywalladdress}
      />
      <PaymentsHistory
        username={username}
        creditPriceDCR={creditPriceDCR}
        credits={[...credits.spentcredits, ...credits.unspentcredits]}
        feePriceDCR={feePriceDCR}
        feeTimestamp={feeTimestamp}
        feeTx={feeTx}
      />
    </>
  );
}

export default UserCredits;
