import React from "react";
import { Link, Button, Spinner, Table } from "pi-ui";
import PropTypes from "prop-types";
import { convertAtomsToDcr } from "src/utilsv2";
import { useAdminPayouts } from "./hooks";
import ExportToCsv from "src/componentsv2/ExportToCsv";
import { Row } from "src/componentsv2/layout";
import styles from "./PayoutsList.module.css";
import { useAdminInvoiceActions } from "../Actions";


const PayoutsList = ({ TopBanner, PageDetails, Main }) => {
  const { loading, payouts } = useAdminPayouts();
  const { onPay } = useAdminInvoiceActions();
  const hasPayouts = !!(!loading && payouts && payouts.length);
  const actions = hasPayouts && (
    <Row noMargin={true} justify="space-between" className={styles.actionsWrapper}>
        <ExportToCsv
          data={payouts}
          fields={["approvedtime", "year", "month", "contractorname", "contractorrate", "labortotal", "expensetotal", "total", "exchangerate", "dcrtotal", "address"]}
          filename="payouts"
          className={styles.csvActionWrapper}>
          <Link className="cursor-pointer">
            Export To Csv
          </Link>
        </ExportToCsv>
      <div>
        <Button className="cursor-pointer" onClick={onPay}>
          Set Invoices To Paid
        </Button>
      </div>
    </Row>);

  return (
    <>
      <TopBanner>
        <PageDetails
          title="Payouts"
          actionsContent={actions}
        >
        </PageDetails>
      </TopBanner>
      <Main fillScreen>
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
        {hasPayouts && (
          <Table
            bodyCellClassName={styles.tableBodyCell}
            headClassName={styles.tableHead}
            data={payouts.map(({ approvedtime, year, month, contractorname, contractorrate, labortotal, expensetotal, total, exchangerate, dcrtotal, address }) => {
              return {
                approvedtime: new Date(approvedtime * 1000).toUTCString(),
                year,
                month,
                contractorname,
                contractorrate: contractorrate / 100,
                labortotal: labortotal / 100,
                expensetotal: expensetotal / 100,
                total: total / 100,
                exchangerate: exchangerate / 100,
                dcrtotal: convertAtomsToDcr(dcrtotal),
                address
              };
            })}
            headers={["Approved Time", "Year", "Month", "Name", "Rate(USD)", "Labor Total(USD)", "Expense Total(USD)", "Combined Total(USD)", "Exchange Rate(USD)", "Total Payment(DCR)", "Address"]}>
          </Table>
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
