import React, { useEffect } from "react";
import PropTypes from "prop-types";
import payouts from "../../connectors/payouts";
import { PageLoadingIcon } from "../snew";
import Message from "../Message";
import PayoutsTable from "./PayoutsTable";

const GeneratePayoutsPage = ({
  payouts,
  error,
  loading,
  onGeneratePayouts
}) => {
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
