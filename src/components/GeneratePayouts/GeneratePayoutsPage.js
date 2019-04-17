import React, { useEffect } from "react";
import PropTypes from "prop-types";
import payouts from "../../connectors/payouts";
import { PageLoadingIcon } from "../snew";
import Message from "../Message";
import PayoutsTable from "./PayoutsTable";
import { exportToCsv } from "../../helpers";

const GeneratePayoutsPage = ({
  payouts,
  error,
  loading,
  onGeneratePayouts
}) => {
  const handleExportPayouts = () => {
    const data = payouts.map(p => ({
      ...p,
      combinedtotal: p.labortotal + p.expensetotal
    }));
    const fields = [
      "year",
      "month",
      "contractorname",
      "contractorrate",
      "labortotal",
      "expensetotal",
      "combinedtotal",
      "address"
    ];
    exportToCsv(data, fields, "payouts");
  };
  const fetchPayouts = () => {
    onGeneratePayouts();
  };
  useEffect(fetchPayouts, []);
  return loading ? (
    <PageLoadingIcon />
  ) : error ? (
    <Message type="error" header="Could not generate payouts" body={error} />
  ) : (
    <div className="content">
      <h1 className="content-title">Payouts</h1>
      <div style={{ paddingLeft: "24px" }}>
        <button
          className="inverse payouts-btn-export-to-csv "
          onClick={handleExportPayouts}
        >
          {"Export to CSV"}
        </button>
        {payouts && <PayoutsTable payouts={payouts} />}
      </div>
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
