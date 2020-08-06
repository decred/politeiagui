import React, { useState } from "react";
import { Card, Spinner, Text, H2, H4, Table, Link as UiLink } from "pi-ui";

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
  const starttimestamp = Math.round(start.valueOf() / 1000);
  const endtimestamp = Math.round(end.valueOf() / 1000);
  const [showStats, setShowStats] = useState(false);
  const toggleShowStats = () => setShowStats(!showStats);
  const { invoices, isUserDeveloper } = useInvoicesSummary(
    invoice.censorshiprecord.token,
    invoice.userid,
    starttimestamp,
    endtimestamp
  );
  const shouldPrintTable = invoices && invoices.length > 0;
  const shouldPrintEmptyMessage = invoices && invoices.length === 0;
  return (
    <Card paddingSize="small">
      <H2 className={styles.statsTitle}>Stats</H2>
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
      {isUserDeveloper && (
        <CodeStats
          userid={invoice.userid}
          start={starttimestamp}
          end={endtimestamp}
        />
      )}
    </Card>
  );
};

export default Stats;
