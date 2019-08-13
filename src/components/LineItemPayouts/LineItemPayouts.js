import React, { useEffect } from "react";
import PropTypes from "prop-types";
import lineItemPayouts from "../../connectors/lineItemPayouts";
import { PageLoadingIcon } from "../snew";
import Message from "../Message";
import LineItemPayoutsTable from "./LineItemPayoutsTable";
import ExportToCsv from "../ExportToCsv";

const LineItemsPayoutsPage = ({
  lineItemPayouts = [],
  error,
  loading,
  loggedInAsEmail,
  onLineItemsPayouts
}) => {
  const fetchLineItemPayouts = () => {
    onLineItemsPayouts();
  };
  useEffect(fetchLineItemPayouts, []);

  const csvData = lineItemPayouts.map(p => ({
    ...p,
    approvedtime: new Date(p.approvedtime * 1000).toString(),
    combinedtotal: p.labortotal + p.expensetotal
  }));
  const csvFields = [
    "approvedtime",
    "year",
    "month",
    "contractorname",
    "contractorrate",
    "labortotal",
    "expensetotal",
    "combinedtotal",
    "exchangerate",
    "dcrtotal",
    "address"
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
