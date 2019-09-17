import React, { useEffect } from "react";
import PropTypes from "prop-types";
import invoicePayouts from "../../connectors/invoicePayouts";
import { PageLoadingIcon, Link } from "../snew";
import Message from "../Message";
import InvoicePayoutsTable from "./InvoicePayoutsTable";
import ExportToCsv from "../ExportToCsv";
import PayoutFilter from "../PayoutFilter";

const InvoicePayoutsPage = ({
  lineItemPayouts = [],
  error,
  loading,
  loggedInAsEmail,
  onInvoicePayouts,
  onChangeStartPayoutDateFilter,
  startMonthFilterValue,
  startYearFilterValue,
  onChangeEndPayoutDateFilter,
  endMonthFilterValue,
  endYearFilterValue
}) => {
  const fetchInvoicePayouts = () => {
    const start = new Date(startYearFilterValue, startMonthFilterValue);
    const end = new Date(endYearFilterValue, endYearFilterValue);
    onInvoicePayouts(
      Math.round(start.valueOf() / 1000),
      Math.round(end.valueOf() / 1000)
    );
  };
  useEffect(fetchInvoicePayouts, []);

  const csvData = lineItemPayouts.map(p => ({
    ...p,
    combinedtotal: p.labor + p.expenses
  }));
  const csvFields = [
    "domain",
    "subdomain",
    "description",
    "proposaltoken",
    "expenses",
    "labor",
    "combinedtotal"
  ];
  return loggedInAsEmail ? (
    loading ? (
      <PageLoadingIcon />
    ) : error ? (
      <div className="content">
        <Message
          type="error"
          header="Could not get line item payouts"
          body={error}
        />
      </div>
    ) : (
      <div className="content">
        <h1 className="content-title">Line Item Payouts</h1>
        <div>
          <>
            <Link
              style={{ marginLeft: "24px" }}
              href="/admin/"
              onClick={() => null}
            >
              Back
            </Link>
          </>
        </div>
        <PayoutFilter
          header={"Start"}
          monthFilterValue={startMonthFilterValue}
          yearFilterValue={startYearFilterValue}
          handleChangeDateFilter={onChangeStartPayoutDateFilter}
        />
        <PayoutFilter
          header={"End"}
          monthFilterValue={endMonthFilterValue}
          yearFilterValue={endYearFilterValue}
          handleChangeDateFilter={onChangeEndPayoutDateFilter}
        />
        <div style={{ paddingLeft: "24px" }}>
          <ExportToCsv data={csvData} fields={csvFields} filename={"payouts"}>
            <button className="inverse payouts-btn-export-to-csv ">
              {"Export to CSV"}
            </button>
          </ExportToCsv>

          {lineItemPayouts && (
            <InvoicePayoutsTable lineItemPayouts={lineItemPayouts} />
          )}
        </div>
        <div id="csv-hidden-div" style={{ display: "none" }} />
      </div>
    )
  ) : (
    <div className="content">
      <Message
        type="error"
        header="Forbidden"
        body="This is an admin protected area. Please login to your account."
      />
    </div>
  );
};

InvoicePayoutsPage.propTypes = {
  lineItemPayouts: PropTypes.array,
  error: PropTypes.string,
  loading: PropTypes.bool,
  onInvoicePayouts: PropTypes.func
};

export default invoicePayouts(InvoicePayoutsPage);
