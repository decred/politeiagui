import React, { useState, useCallback, useEffect } from "react";
import { Spinner, Link } from "pi-ui";
import { Row } from "src/componentsv2/layout";
import { PayoutsDateRange } from "src/componentsv2/PayoutsDateRange";
import { useInvoicePayouts } from "./hooks";
import styles from "./PayoutSummaries.module.css";

const InvoicePayoutsList = ({ TopBanner, PageDetails, Main }) => {
  const [dates, setDates] = useState({});
  const { loading, lineItemPayouts, onInvoicePayouts } = useInvoicePayouts();
  const hasLineItemPayouts = !!(!loading && lineItemPayouts && lineItemPayouts.length);
  const fetchInvoicePayouts = () => {
    if (!dates.sDate || !dates.eDate) {
      return;
    }
    const start = new Date(dates.sDate.year, dates.sDate.month);
    const end = new Date(dates.eDate.year, dates.eDate.month);
    onInvoicePayouts(
      Math.round(start.valueOf() / 1000),
      Math.round(end.valueOf() / 1000)
    );
  };
  useEffect(fetchInvoicePayouts, [dates]);

  const handleDatesChange = useCallback(
    (values) => {
      setDates(values);
    },
    [setDates]
  );

  return (
    <>
      <TopBanner>
        <PageDetails
          title="Line Item Payouts"
          actionsContent={<Row><Link className="cursor-pointer">Export To Csv</Link></Row>}
        >
          <PayoutsDateRange onChange={handleDatesChange}></PayoutsDateRange>
        </PageDetails>
      </TopBanner>
      <Main>
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
        {hasLineItemPayouts && (
          lineItemPayouts.length
        )}
      </Main>
    </>
  );
};

export default InvoicePayoutsList;
