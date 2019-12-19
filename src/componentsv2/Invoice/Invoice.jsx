import {
  classNames,
  StatusTag,
  Text,
  useMediaQuery,
  CopyableText
} from "pi-ui";
import React, { useMemo } from "react";
import RecordWrapper from "../RecordWrapper";
import { getInvoiceStatusTagProps } from "./helpers";
import styles from "./Invoice.module.css";
import { InvoiceActions } from "src/containers/Invoice/Actions";
import {
  presentationalInvoiceName,
  getInvoiceTotalHours
} from "src/containers/Invoice/helpers";
import Field from "./Field";
import InvoiceDatasheet from "../InvoiceDatasheet";
import { convertAtomsToDcr } from "src/utilsv2";
import ThumbnailGrid from "src/componentsv2/Files";

const Invoice = ({ invoice, extended, collapseBodyContent }) => {
  const {
    censorshiprecord,
    file,
    input,
    // status,
    timestamp,
    userid,
    username,
    version,
    payout
  } = invoice;

  const mobile = useMediaQuery("(max-width: 560px)");

  const invoiceToken = censorshiprecord && censorshiprecord.token;
  const invoiceURL = `/invoices/${invoiceToken}`;
  const invContractorName = input && input.contractorname;
  const invContractorLocation = input && input.contractorlocation;
  const invContractorRate = input && input.contractorrate;
  const invContractorContact = input && input.contractorcontact;
  const paymentAddress = input && input.paymentaddress;
  const exchangeRate = input && input.exchangerate;
  const totalHours = getInvoiceTotalHours(invoice);
  const totalExpenses = payout && payout.expensetotal / 100;
  const totalAmount = payout && payout.total / 100;
  const totalDcrAmount = payout && convertAtomsToDcr(payout.dcrtotal);

  // record attchments without the invoice file
  const invoiceAttachments = useMemo(
    () => (file || []).filter((f) => !f.mime.includes("text/")),
    [file]
  );

  return (
    <RecordWrapper>
      {({
        Author,
        Event,
        Row,
        Title,
        Header,
        Subtitle,
        Status,
        RecordToken
      }) => {
        return (
          <>
            <Header
              title={
                <Title
                  id={`invoice-title-${invoiceToken}`}
                  truncate
                  linesBeforeTruncate={2}
                  url={extended ? "" : invoiceURL}>
                  {presentationalInvoiceName(invoice)}
                </Title>
              }
              subtitle={
                <Subtitle>
                  <Author username={username} id={userid} />
                  <Event event="edited" timestamp={timestamp} />
                  {version > 1 && !mobile && (
                    <Text
                      id={`invoice-${invoiceToken}-version`}
                      className={classNames(styles.version)}
                      color="gray"
                      truncate>{`version ${version}`}</Text>
                  )}
                </Subtitle>
              }
              status={
                <Status>
                  <StatusTag
                    className={styles.statusTag}
                    {...getInvoiceStatusTagProps(invoice)}
                  />
                </Status>
              }
            />
            {extended && (
              <>
                <Row topMarginSize="s">
                  <RecordToken token={invoiceToken} />
                </Row>
                <Row justify="space-between" className={styles.topDetails}>
                  <div className={styles.field}>
                    <Text weight="semibold">{invContractorName}</Text>
                    <Text>{invContractorLocation}</Text>
                    <Text>{invContractorContact}</Text>
                  </div>
                  <Field
                    label={"Pay to Address:"}
                    value={paymentAddress}
                    renderValue={(addr) => (
                      <CopyableText
                        id="payment-address"
                        truncate
                        tooltipPlacement={"bottom"}>
                        {addr}
                      </CopyableText>
                    )}
                  />
                </Row>
                <Row justify="space-between" className={styles.topDetails}>
                  <Field label="Total hours:" value={`${totalHours}h`} />
                  <Field
                    label="Contractor Rate:"
                    value={`$${invContractorRate / 100}`}
                  />
                  <Field label="Total expenses:" value={`$${totalExpenses}`} />
                  <Field
                    label="Exchange rate:"
                    value={`$${exchangeRate / 100}`}
                  />
                  <Field label="Amount:" value={`$${totalAmount}`} />
                  <Field label="Amount (dcr):" value={totalDcrAmount} />
                </Row>
                {extended && !!invoiceAttachments.length && (
                  <Row
                    className={styles.filesRow}
                    justify="left"
                    topMarginSize="s">
                    <ThumbnailGrid
                      value={invoiceAttachments}
                      onClick={() => null}
                      viewOnly={true}
                    />
                  </Row>
                )}
                <InvoiceDatasheet
                  value={invoice && invoice.input.lineitems}
                  readOnly
                  userRate={invContractorRate / 100}
                />
              </>
            )}
            <InvoiceActions invoice={invoice} />
          </>
        );
      }}
    </RecordWrapper>
  );
};

export default Invoice;
