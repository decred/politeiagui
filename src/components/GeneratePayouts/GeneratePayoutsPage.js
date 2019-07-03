import React, { useEffect } from "react";
import PropTypes from "prop-types";
import * as modalTypes from "../Modal/modalTypes";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";
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
  onGeneratePayouts,
  onPayApprovedInvoices,
  confirmWithModal
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
        <div className=" payouts-btn-pay-invoices">
          <ButtonWithLoadingIcon
            className="inverse"
            onClick={e =>
              confirmWithModal(modalTypes.CONFIRM_ACTION, {
                message:
                  "Are you sure you want to set all of these approved invoices to paid?"
              }).then(confirm => confirm && onPayApprovedInvoices()) &&
              e.preventDefault()
            }
            text="Set invoices to paid"
            isLoading={false}
          />
        </div>
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
