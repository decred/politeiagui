import React from "react";
import proposalCreditsConnector from "../../connectors/proposalCredits";


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

const ProposalCreditsSummary = ({
  isApiRequestingUserProposalCredits,
  onUserProposalCredits,
  proposalCredits,
  proposalCreditPurchases,
  isTestnet
}) => (
  <div className="proposal-credits-summary">
    <div className="available-credits">
      <b>Available credits:</b> {proposalCredits} {isApiRequestingUserProposalCredits ? (
        <div className="refreshing"><div className="logo spin"></div></div>
      ) : (
        <a className="refresh" onClick={onUserProposalCredits}>(refresh)</a>
      )}
    </div>
    {proposalCreditPurchases && proposalCreditPurchases.length ? (
      <div className="credit-purchase-table">
        <div className="credit-purchase-header">
          <div className="credit-purchase-row">
            <div className="credit-purchase-cell credit-purchase-date">Date purchased</div>
            <div className="credit-purchase-cell credit-purchase-number">Number purchased</div>
            <div className="credit-purchase-cell credit-purchase-price">Price per credit</div>
            <div className="credit-purchase-cell credit-purchase-tx">Transaction</div>
            <div className="clear"></div>
          </div>
        </div>
        <div className="credit-purchase-body">
          {proposalCreditPurchases.map((creditPurchase, i) => (
            <div className="credit-purchase-row" key={i}>
              <div className="credit-purchase-cell credit-purchase-date">
                {new Date(creditPurchase.datePurchased * 1000).toUTCString()}
              </div>
              <div className="credit-purchase-cell credit-purchase-number">{creditPurchase.numberPurchased}</div>
              <div className="credit-purchase-cell credit-purchase-price">{creditPurchase.price} DCR</div>
              <div className="credit-purchase-cell credit-purchase-tx">
                <DcrdataTxLink isTestnet={isTestnet} txId={creditPurchase.txId} />
              </div>
              <div className="clear"></div>
            </div>
          ))}
        </div>
      </div>
    ) : null}
  </div>
);

export default proposalCreditsConnector(ProposalCreditsSummary);
