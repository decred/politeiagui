import React, { useEffect } from "react";
import PropTypes from "prop-types";
import lineItemPayouts from "../../connectors/lineItemPayouts";
import { PageLoadingIcon, Link } from "../snew";
import Message from "../Message";
import LineItemPayoutsTable from "./LineItemPayoutsTable";
import ExportToCsv from "../ExportToCsv";
import PayoutFilter from "../PayoutFilter";

const LineItemsPayoutsPage = ({
  lineItemPayouts = [],
  error,
  loading,
  loggedInAsEmail,
  onLineItemPayouts,
  onChangeStartPayoutDateFilter,
  startMonthFilterValue,
  startYearFilterValue,
  onChangeEndPayoutDateFilter,
  endMonthFilterValue,
  endYearFilterValue
}) => {
  const fetchLineItemPayouts = () => {
    const start = new Date(startYearFilterValue, startMonthFilterValue);
    const end = new Date(endYearFilterValue, endYearFilterValue);
    onLineItemPayouts(
      Math.round(start.valueOf() / 1000),
      Math.round(end.valueOf() / 1000)
    );
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
