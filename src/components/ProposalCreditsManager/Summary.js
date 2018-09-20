import React from "react";

const DcrdataTxLink = ({
  isTestnet,
  txId
}) => {
  const network = isTestnet ? "testnet" : "explorer";
  return (
    <a href={`https://${network}.dcrdata.org/tx/${txId}`} target="_blank">
      {txId}
    </a>
  );
};

const formatDate = (date) => {
  const d = new Date(date * 1000);
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const time = d.getUTCHours() + ":" + d.getUTCMinutes();
  return year + "-" + month + "-" + day + "  |  " + time;
};

const ProposalCreditsSummary = ({
  proposalCredits,
  proposalCreditPrice,
  proposalCreditPurchases,
  isTestnet,
  lastPaymentNotConfirmed
}) => {
  if (lastPaymentNotConfirmed) {
    const transaction = {
      numberPurchased: lastPaymentNotConfirmed.amount * 10,
      txId: lastPaymentNotConfirmed.txid,
      price: proposalCreditPrice,
      confirming: true
    };
    proposalCreditPurchases.push(transaction);
  }
  const reverseProposalCreditPurchases = proposalCreditPurchases.slice(0).reverse();
  return (
    <div className="proposal-credits-summary">
      <div className="available-credits">
        <b>Available credits:</b> {proposalCredits}
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
                    (<div className="user-proposal-credits-cell"><div className="logo"></div></div>)
                    : "✔"
                  }
                </div>
                <div className="credit-purchase-cell credit-purchase-date-text">
                  {/* {new Date(creditPurchase.datePurchased * 1000).toUTCString()} */}
                  { creditPurchase.datePurchased ? formatDate(creditPurchase.datePurchased) : "" }
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
