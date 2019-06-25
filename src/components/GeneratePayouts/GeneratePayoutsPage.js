import React, { useEffect } from "react";
import PropTypes from "prop-types";
import payouts from "../../connectors/payouts";
import { PageLoadingIcon } from "../snew";
import Message from "../Message";
import PayoutsTable from "./PayoutsTable";
import ExportToCsv from "../ExportToCsv";

const GeneratePayoutsPage = ({
  payouts = [],
  error,
  loading,
  loggedInAsEmail,
  onGeneratePayouts
}) => {
  const fetchPayouts = () => {
    onGeneratePayouts();
  };
  useEffect(fetchPayouts, []);

  const csvData = payouts.map(p => ({
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
          header="Could not generate payouts"
          body={error}
        />
      </div>
    ) : (
      <div className="content">
        <h1 className="content-title">Payouts</h1>
        <div style={{ paddingLeft: "24px" }}>
          <ExportToCsv data={csvData} fields={csvFields} filename={"payouts"}>
            <button className="inverse payouts-btn-export-to-csv ">
              {"Export to CSV"}
            </button>
          </ExportToCsv>

          {payouts && <PayoutsTable payouts={payouts} />}
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

GeneratePayoutsPage.propTypes = {
  payouts: PropTypes.array,
  error: PropTypes.string,
  loading: PropTypes.bool,
  onGeneratePayouts: PropTypes.func
};

export default payouts(GeneratePayoutsPage);
