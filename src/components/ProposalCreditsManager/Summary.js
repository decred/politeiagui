import React from "react";
import { CONFIRMATIONS_REQUIRED } from "../../constants";

const DcrdataTxLink = ({
  isTestnet,
  txId
}) => {
  const network = isTestnet ? "testnet" : "explorer";
  return (
    <a href={`https://${network}.dcrdata.org/tx/${txId}`} target="_blank" rel="noopener noreferrer">
      {txId}
    </a>
  );
};

const formatDate = (date) => {
  const d = new Date(date * 1000);
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const _minutes = d.getUTCMinutes();
  const minutes = _minutes < 10 ? `0${_minutes}` : _minutes;
  const time = d.getUTCHours() + ":" + minutes;
  return year + "-" + month + "-" + day + "  |  " + time;
};

const ProposalCreditsSummary = ({
  proposalCredits,
  proposalCreditPrice,
  proposalCreditPurchases,
  isTestnet,
  recentPaymentsConfirmed,
  proposalPaywallPaymentTxid,
  proposalPaywallPaymentAmount,
  proposalPaywallPaymentConfirmations,
  pollingCreditsPayment,
  toggleCreditsPaymentPolling
}) => {
  if (recentPaymentsConfirmed && recentPaymentsConfirmed.length > 0) {
    recentPaymentsConfirmed.forEach(payment => {
      const transaction = {
        numberPurchased: payment.amount,
        txId: payment.txid,
        price: proposalCreditPrice,
        confirming: false,
        datePurchased: "just now"
      };
      if (!proposalCreditPurchases.find(el => el.txId === transaction.txId)) proposalCreditPurchases.push(transaction);
    });
  }
  if (proposalPaywallPaymentTxid) {
    const transaction = {
      numberPurchased: Math.round(proposalPaywallPaymentAmount * 1/(proposalCreditPrice * 100000000)),
      txId: proposalPaywallPaymentTxid,
      price: proposalCreditPrice,
      confirmations: proposalPaywallPaymentConfirmations,
      confirming: true
    };
    proposalCreditPurchases.push(transaction);
  }
  const reverseProposalCreditPurchases = proposalCreditPurchases.slice(0).reverse();
  return (
    <div className="proposal-credits-summary">
      <div className="available-credits">
        <span> <b>Available credits:</b> {proposalCredits}</span>
        {pollingCreditsPayment ? <div className="searching-credits">
          <i className="fa fa-circle-o-notch fa-spin right-margin-5" style={{ fontSize: "14px" }}></i>
          {proposalPaywallPaymentTxid ?
            <div className="searching-credits__text">
              <span>Checking for payment confirmation</span>
              <span className="font-12">The payment can take a few minutes to be confirmed</span>
            </div> :
            <div className="searching-credits__text">
              <span>Searching for a new payment</span>
              <span className="font-12">The payment can take a few minutes to be confirmed</span>
            </div>
          }
        </div> :
          <button
            className="inverse"
            onClick={() => toggleCreditsPaymentPolling(true)}
          >
            {"Check for payments"}
          </button>
        }
      </div>
      {proposalCreditPurchases && proposalCreditPurchases.length ? (
        <div className="credit-purchase-table">
          <div className="credit-purchase-header">
            <div className="credit-purchase-row">
              <div className="credit-purchase-cell credit-purchase-number">#</div>
              <div className="credit-purchase-cell credit-purchase-price">DCR per credit</div>
              <div className="credit-purchase-cell credit-purchase-tx">Transaction</div>
              <div className="credit-purchase-cell credit-purchase-status">Status</div>
              <div className="credit-purchase-cell credit-purchase-date">Date</div>
              <div className="clear"></div>
            </div>
          </div>
          <div className="credit-purchase-body">
            {reverseProposalCreditPurchases.map((creditPurchase, i) => (
              <div className="credit-purchase-row" key={i}>
                <div className="credit-purchase-cell credit-purchase-number">{creditPurchase.numberPurchased}</div>
                <div className="credit-purchase-cell credit-purchase-price">{creditPurchase.price} DCR</div>
                <div className="credit-purchase-cell credit-purchase-tx">
                  <DcrdataTxLink isTestnet={isTestnet} txId={creditPurchase.txId} />
                </div>
                <div className="credit-purchase-cell credit-purchase-status">
                  { creditPurchase.confirming ?
                    (<div className="user-proposal-credits-cell" style={{ color: "#ff8100", fontWeight: "bold" }}><div>
											Awaiting confirmations: </div>({creditPurchase.confirmations} of {CONFIRMATIONS_REQUIRED })</div>)
                    : <div style={{ fontWeight: "bold", color: "green" }}>Confirmed</div>
                  }
                </div>
                <div className="credit-purchase-cell credit-purchase-date-text">
                  {
                    creditPurchase.datePurchased ?
                      creditPurchase.datePurchased === "just now" ? "just now" :
                        formatDate(creditPurchase.datePurchased)
                      : ""
                  }
                </div>
                <div className="clear"></div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProposalCreditsSummary;
