import React, { useState, memo } from "react";
import { Spinner, Text, H4, Table, Link as UiLink } from "pi-ui";
import Link from "src/components/Link";
import { useInvoicesSummary } from "./hooks";
import { formatCentsToUSD } from "src/utils";
import styles from "./Detail.module.css";

const headers = ["Date", "Invoice", "Total (USD)"];

const printInvoiceInfo = ({
  total,
  censorshiprecord: { token },
  input: { month, year }
}) => ({
  Date: `${month}/${year}`,
  Invoice: (
    <Link to={`/invoices/${token}`} className={styles.invoiceLinkWrapper}>
      <Text color="primary">{token.substring(0, 7)}</Text>
    </Link>
  ),
  "Total (USD)": formatCentsToUSD(total)
});

const InvoiceDetails = ({ token, userid, start, end }) => {
  const [showStats, setShowStats] = useState(false);
  const toggleShowStats = () => setShowStats(!showStats);
  const { invoices } = useInvoicesSummary(token, userid, start, end);
  const shouldPrintTable = invoices && invoices.length > 0;
  const shouldPrintEmptyMessage = invoices && invoices.length === 0;
  return (
    <>
      <div className={styles.titleLinkWrapper}>
        <H4>Past 3 months invoices</H4>
        <UiLink className={styles.uilink} onClick={toggleShowStats}>
          {shouldPrintEmptyMessage ? "" : showStats ? "Hide" : "Show"}
        </UiLink>
      </div>
      {showStats && shouldPrintTable ? (
        <Table headers={headers} data={invoices.map(printInvoiceInfo)} />
      ) : shouldPrintEmptyMessage ? (
        <Text>No invoices for the past 3 months</Text>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default memo(InvoiceDetails);
