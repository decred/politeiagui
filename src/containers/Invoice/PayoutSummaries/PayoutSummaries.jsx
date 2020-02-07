import React, { useState, useCallback, useEffect } from "react";
import { Spinner, Link, Table, CopyableText } from "pi-ui";
import PropTypes from "prop-types";
import ExportToCsv from "src/componentsv2/ExportToCsv";
import { convertAtomsToDcr } from "src/utilsv2";
import { Row } from "src/componentsv2/layout";
import HelpMessage from "src/componentsv2/HelpMessage";
import { PayoutsDateRange } from "src/componentsv2/PayoutsDateRange";
import { useInvoicePayouts } from "./hooks";
import styles from "./PayoutSummaries.module.css";

const InvoicePayoutsList = ({ TopBanner, PageDetails, Main }) => {
  const [dates, setDates] = useState({
    sDate: null,
    eDate: null
  });
  const { loading, lineItemPayouts, onInvoicePayouts } = useInvoicePayouts();
  const hasLineItemPayouts = !loading && lineItemPayouts && lineItemPayouts.length > 0;
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
          actionsContent={null}
        >
          <PayoutsDateRange onChange={handleDatesChange}></PayoutsDateRange>
        </PageDetails>
      </TopBanner>
      <Main fillScreen>
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
        {hasLineItemPayouts && (
          <>
            <Table
              bodyCellClassName={styles.tableBodyCell}
              headClassName={styles.tableHead}
              data={lineItemPayouts.map(({ year, month, token, domain, subdomain, description, proposaltoken, expenses, labor, paiddate, amountreceived }) => {
                return {
                  month: `${month}/${year}`,
                  invoicetoken: token && <CopyableText
                    truncate
                    id={`invoice-token-${token}`}
                    className={styles.copyableText}
                    tooltipPlacement={"left"}>
                    {token}
                  </CopyableText>,
                  domain,
                  subdomain,
                  description,
                  proposaltoken: proposaltoken && <CopyableText
                    truncate
                    id={`proposal-token-${proposaltoken}`}
                    className={styles.copyableText}
                    tooltipPlacement={"left"}>
                    {proposaltoken}
                  </CopyableText>,
                  expenses,
                  labor,
                  total: labor + expenses,
                  paiddate,
                  amountreceived: convertAtomsToDcr(amountreceived)
                };
              })}
              headers={["Date", "Invoice Token", "Domain", "Sub Domain", "Description", "Proposal Token", "Expense(USD)", "Labor(USD)", "Total(USD)", "Paid Date", "Amount Received(DCR)"]}>
            </Table>
            <Row noMargin justify="right">
              <ExportToCsv
                data={lineItemPayouts}
                fields={["year", "month", "token", "domain", "subdomain", "description", "proposaltoken", "expenses", "labor", "paiddate", "amountreceived"]}
                filename="payouts">
                <Link className="cursor-pointer">
                  Export To Csv
                </Link>
              </ExportToCsv>
            </Row>
          </>
        )}
        {!hasLineItemPayouts && (
          <HelpMessage>
            {"No payouts in the given time range!"}
          </HelpMessage>
        )}
      </Main>
    </>
  );
};

InvoicePayoutsList.propTypes = {
  TopBanner: PropTypes.func.isRequired,
  PageDetails: PropTypes.func.isRequired,
  Main: PropTypes.func.isRequired
};

export default InvoicePayoutsList;
