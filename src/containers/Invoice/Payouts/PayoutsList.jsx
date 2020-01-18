import React from "react";
import { Link, Spinner, Table } from "pi-ui";
import { useAdminPayouts } from "./hooks";
import ExportToCsv from "src/componentsv2/ExportToCsv";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import { Row } from "src/componentsv2/layout";
import styles from "./PayoutsList.module.css";

const PayoutsList = ({ TopBanner, PageDetails, Main }) => {
  const { loading, payouts } = useAdminPayouts();
  return (
    <AdminInvoiceActionsProvider>
      <TopBanner>
        <PageDetails
          title="Payouts"
          actionsContent={
            <Row justify="space-between" className={styles.actionsWrapper}>
              <div>
                <ExportToCsv
                  data={payouts}
                  fields={["approvedtime", "year", "month", "contractorname", "contractorrate", "labortotal", "expensetotal", "total", "exchangerate", "dcrtotal", "address"]}
                  filename="payouts">
                  <Link className="cursor-pointer">
                    Export To Csv
                  </Link>
                </ExportToCsv>
              </div>
              <div>
                <Link className="cursor-pointer">
                  Set Invoices To Paid
                </Link>
              </div>
            </Row>
          }
        >
        </PageDetails>
      </TopBanner>
      <Main fillScreen>
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
        {!loading && payouts && (
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
                dcrtotal: dcrtotal / 100000000,
                address
              };
            })}
            headers={["Approved Time", "Year", "Month", "Name", "Rate(USD)", "Labor Total(USD)", "Expense Total(USD)", "Combined Total(USD)", "Exchange Rate(USD)", "Total Payment(DCR)", "Address"]}>
          </Table>
        )}
      </Main>
    </AdminInvoiceActionsProvider>
  );
};

export default PayoutsList;
