import { classNames, StatusTag, Text, useMediaQuery } from "pi-ui";
import React from "react";
import RecordWrapper from "../RecordWrapper";
import { getInvoiceStatusTagProps } from "./helpers";
import styles from "./Invoice.module.css";
import { InvoiceActions } from "src/containers/Invoice/Actions";
import { presentationalInvoiceName } from "src/containers/Invoice/helpers";

const Invoice = ({ invoice, extended, collapseBodyContent }) => {
  const {
    censorshiprecord,
    file,
    input,
    status,
    timestamp,
    userid,
    username,
    version
  } = invoice;

  const mobile = useMediaQuery("(max-width: 560px)");

  const invoiceToken = censorshiprecord && censorshiprecord.token;
  const invoiceURL = `/invoices/${invoiceToken}`;
  const invoiceMonth = input && input.month;
  const invoiceYear = input && input.year;
  const invContractorName = input && input.contractorname;

  return (
    <RecordWrapper>
      {({
        Author,
        Event,
        Row,
        Title,
        CommentsLink,
        GithubLink,
        ChartsLink,
        DownloadRecord,
        Header,
        Subtitle,
        Edit,
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
                  url={extended ? "" : invoiceURL}
                >
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
                      truncate
                    >{`version ${version}`}</Text>
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
            <InvoiceActions invoice={invoice} />
          </>
        );
      }}
    </RecordWrapper>
  );
};

export default Invoice;
