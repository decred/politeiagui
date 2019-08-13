import React, { useEffect } from "react";
import PropTypes from "prop-types";
import lineItemPayouts from "../../connectors/lineItemPayouts";
import { PageLoadingIcon, Link } from "../snew";
import Message from "../Message";
import LineItemPayoutsTable from "./LineItemPayoutsTable";
import ExportToCsv from "../ExportToCsv";
import DateFilter from "../DateFilter";

const LineItemsPayoutsPage = ({
  lineItemPayouts = [],
  error,
  loading,
  loggedInAsEmail,
  onLineItemPayouts,
  onChangeStartPayoutDateFilter,
  onResetStartPayoutDateFilter,
  startMonthFilterValue,
  startYearFilterValue,
  onChangeEndPayoutDateFilter,
  onResetEndPayoutDateFilter,
  endMonthFilterValue,
  endYearFilterValue
}) => {
  const fetchLineItemPayouts = () => {
    const today = new Date();
    const monthsBack = new Date();
    monthsBack.setMonth(3);
    const start = Math.round(monthsBack.valueOf() / 1000);
    const end = Math.round(today.valueOf() / 1000);
    onLineItemPayouts(start, end);
  };
  useEffect(fetchLineItemPayouts, []);

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
        <DateFilter
          header={true}
          monthFilterValue={startMonthFilterValue}
          yearFilterValue={startYearFilterValue}
          handleChangeDateFilter={onChangeStartPayoutDateFilter}
          handleResetDateFilter={onResetStartPayoutDateFilter}
        />
        <DateFilter
          header={true}
          monthFilterValue={endMonthFilterValue}
          yearFilterValue={endYearFilterValue}
          handleChangeDateFilter={onChangeEndPayoutDateFilter}
          handleResetDateFilter={onResetEndPayoutDateFilter}
        />
        <div style={{ paddingLeft: "24px" }}>
          <ExportToCsv data={csvData} fields={csvFields} filename={"payouts"}>
            <button className="inverse payouts-btn-export-to-csv ">
              {"Export to CSV"}
            </button>
          </ExportToCsv>

          {lineItemPayouts && (
            <LineItemPayoutsTable lineItemPayouts={lineItemPayouts} />
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

LineItemsPayoutsPage.propTypes = {
  lineItemPayouts: PropTypes.array,
  error: PropTypes.string,
  loading: PropTypes.bool,
  onLineItemsPayouts: PropTypes.func
};

export default lineItemPayouts(LineItemsPayoutsPage);
