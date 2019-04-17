import React from "react";
import { exportToCsv, formatDate } from "../../helpers";
import { CONFIRMATIONS_REQUIRED } from "../../constants";
import DcrdataTxLink from "../DcrdataTxLink";

const exportData = data => {
  data = data
    .filter(d => !d.confirming)
    .map(d => ({
      ...d,
      datePurchased: d.datePurchased ? formatDate(d.datePurchased) : "",
      price: d.type === "fee" ? "" : d.price
    }));
  const fields = ["numberPurchased", "price", "txId", "datePurchased", "type"];
  exportToCsv(data, fields, "payment_history");
};

const ProposalCreditsSummary = ({
  proposalCreditPrice,
  proposalCreditPurchases,
  isTestnet,
  proposalPaywallPaymentTxid,
  proposalPaywallPaymentAmount,
  proposalPaywallPaymentConfirmations
}) => {
  const isThereAnyCompletedPurchase =
    proposalCreditPurchases && proposalCreditPurchases.length > 0;

  if (proposalPaywallPaymentTxid) {
    const transaction = {
      numberPurchased: Math.round(
        (proposalPaywallPaymentAmount * 1) / (proposalCreditPrice * 100000000)
      ),
      txId: proposalPaywallPaymentTxid,
      price: proposalCreditPrice,
      confirmations: proposalPaywallPaymentConfirmations,
      confirming: true,
      datePurchased: "just now"
    };
    proposalCreditPurchases.push(transaction);
  }

  const reverseProposalCreditPurchases = proposalCreditPurchases
    .slice(0)
    .reverse();

  return (
    <div className="proposal-credits-summary">
      {isThereAnyCompletedPurchase ? (
        <div className="credits-purchase-menu">
          <button
            className="inverse credits-purchase-menu__button"
            onClick={() => exportData(proposalCreditPurchases)}
          >
            {"Export to CSV"}
          </button>
        </div>
      ) : null}
      {proposalCreditPurchases && proposalCreditPurchases.length ? (
        <div className="credit-purchase-table">
          <div className="credit-purchase-header">
            <div className="credit-purchase-row">
              <div className="credit-purchase-cell credit-purchase-number">
                Amount
              </div>
              <div className="credit-purchase-cell credit-purchase-price">
                DCRs
              </div>
              <div className="credit-purchase-cell credit-purchase-tx">
                Transaction
              </div>
              <div className="credit-purchase-cell credit-purchase-status">
                Status
              </div>
              <div className="credit-purchase-cell credit-purchase-date">
                Date
              </div>
              <div className="credit-purchase-cell credit-purchase-type">
                Type
              </div>
              <div className="clear" />
            </div>
          </div>
          <div className="credit-purchase-body">
            {reverseProposalCreditPurchases.map((creditPurchase, i) => (
              <div className="credit-purchase-row" key={i}>
                <div className="credit-purchase-cell credit-purchase-number">
                  {creditPurchase.numberPurchased}
                </div>
                <div className="credit-purchase-cell credit-purchase-price">
                  {creditPurchase.numberPurchased === "N/A"
                    ? creditPurchase.price
                    : (
                        creditPurchase.numberPurchased * creditPurchase.price
                      ).toFixed(2) + " DCR"}
                </div>
                <div className="credit-purchase-cell credit-purchase-tx">
                  <DcrdataTxLink
                    isTestnet={isTestnet}
                    txId={creditPurchase.txId}
                  />
                </div>
                <div className="credit-purchase-cell credit-purchase-status">
                  {creditPurchase.confirming ? (
                    <div
                      className="user-proposal-credits-cell"
                      style={{ color: "#ff8100" }}
                    >
                      <div>waiting confirmations: </div>(
                      {creditPurchase.confirmations} of {CONFIRMATIONS_REQUIRED}
                      )
                    </div>
                  ) : (
                    <div style={{ color: "green" }}>confirmed</div>
                  )}
                </div>
                <div className="credit-purchase-cell credit-purchase-date-text">
                  {creditPurchase.datePurchased
                    ? creditPurchase.datePurchased === "just now"
                      ? "just now"
                      : formatDate(creditPurchase.datePurchased)
                    : "-"}
                </div>
                <div className="credit-purchase-cell credit-purchase-type">
                  {creditPurchase.type === "fee"
                    ? "registration fee"
                    : "credits"}
                </div>
                <div className="clear" />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProposalCreditsSummary;
