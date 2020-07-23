import React from "react";
import { Card, Spinner, Text, H2, H4, Table } from "pi-ui";

import { useInvoicesSummary } from "./hooks";
import CodeStats from "./CodeStats";
import Link from "src/components/Link";
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
      <Text color="primary">{token}</Text>
    </Link>
  ),
  "Total (USD)": formatCentsToUSD(total)
});

const Stats = ({ invoice }) => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);
  const { invoices, isUserDeveloper } = useInvoicesSummary(
    invoice.censorshiprecord.token,
    invoice.userid,
    Math.round(start.valueOf() / 1000),
    Math.round(end.valueOf() / 1000)
  );
  const shouldPrintTable = invoices && invoices.length > 0;
  const shouldPrintEmptyMessage = invoices && invoices.length === 0;
  return (
    <Card paddingSize="small">
      <H2 className={styles.statsTitle}>Stats</H2>
      <H4>Past 3 months invoices</H4>
      {shouldPrintTable ? (
        <Table headers={headers} data={invoices.map(printInvoiceInfo)} />
      ) : shouldPrintEmptyMessage ? (
        <Text>No invoices for this period</Text>
      ) : (
        <Spinner />
      )}
      {isUserDeveloper && <CodeStats userid={invoice.userid} />}
    </Card>
  );
};

export default Stats;
