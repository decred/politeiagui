import React from "react";
import { Link, Button, Spinner, Table, CopyableText, classNames } from "pi-ui";
import PropTypes from "prop-types";
import { convertAtomsToDcr, formatShortUnixTimestamp } from "src/utils";
import { useAdminPayouts } from "./hooks";
import ExportToCsv from "src/components/ExportToCsv";
import HelpMessage from "src/components/HelpMessage";
import { Row } from "src/components/layout";
import styles from "./PayoutsList.module.css";
import { useAdminInvoiceActions } from "../Actions";

const PayoutsList = ({ TopBanner, PageDetails, Main }) => {
  const { loading, payouts } = useAdminPayouts();
  const { onPay } = useAdminInvoiceActions();
  const hasPayouts = !loading && payouts && payouts.length > 0;
  const actions = hasPayouts && (
    <Button
      className={classNames("cursor-pointer", styles.payBtn)}
      onClick={onPay}>
      Set invoices to paid
    </Button>
  );

  return (
    <>
      <TopBanner>
        <PageDetails title="Payouts" actionsContent={actions}></PageDetails>
      </TopBanner>
      <Main fillScreen>
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
        {hasPayouts && (
          <>
            <Table
              bodyCellClassName={styles.tableBodyCell}
              headClassName={styles.tableHead}
              data={payouts.map(
                ({
                  approvedtime,
                  year,
                  month,
                  contractorname,
                  contractorrate,
                  labortotal,
                  expensetotal,
                  total,
                  exchangerate,
                  dcrtotal,
                  address
                }) => {
                  return {
                    approvedtime: formatShortUnixTimestamp(approvedtime),
                    month: `${month}/${year}`,
                    contractorname,
                    contractorrate: contractorrate / 100,
                    labortotal: labortotal / 100,
                    expensetotal: expensetotal / 100,
                    total: total / 100,
                    exchangerate: exchangerate / 100,
                    dcrtotal: convertAtomsToDcr(dcrtotal),
                    address: (
                      <CopyableText
                        truncate
                        id={`payment-address-${approvedtime}`}
                        className={styles.copyableText}
                        tooltipPlacement={"left"}>
                        {address}
                      </CopyableText>
                    )
                  };
                }
              )}
              headers={[
                "Approved Time",
                "Date",
                "Name",
                "Rate(USD)",
                "Labor Total(USD)",
                "Expense Total(USD)",
                "Combined Total(USD)",
                "Exchange Rate(USD)",
                "Total Payment(DCR)",
                "Address"
              ]}></Table>
            <Row noMargin justify="right">
              <ExportToCsv
                data={payouts}
                fields={[
                  "approvedtime",
                  "year",
                  "month",
                  "contractorname",
                  "contractorrate",
                  "labortotal",
                  "expensetotal",
                  "total",
                  "exchangerate",
                  "dcrtotal",
                  "address"
                ]}
                filename="payouts">
                <Link className="cursor-pointer">Export To Csv</Link>
              </ExportToCsv>
            </Row>
          </>
        )}
        {!hasPayouts && (
          <HelpMessage>{"There are no approved invoices!"}</HelpMessage>
        )}
      </Main>
    </>
  );
};

PayoutsList.propTypes = {
  TopBanner: PropTypes.func.isRequired,
  PageDetails: PropTypes.func.isRequired,
  Main: PropTypes.func.isRequired
};

export default PayoutsList;
