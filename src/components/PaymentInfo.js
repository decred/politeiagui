import React from "react";
import QRCode from "./QRCode";
import Tooltip from "./Tooltip";
import Status from "./Paywall/Status";
import DcrdataTxLink from "./DcrdataTxLink";
import { PAYWALL_STATUS_LACKING_CONFIRMATIONS } from "../constants";

const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const centralizeStyle = {
  display: "flex",
  justifyContent: "center",
  width: "100%"
};

const PaymentPanel = ({
  paywallAddress,
  amount,
  paywallStatus,
  paywallConfirmations,
  paywallTxid,
  isTestnet
}) => {
  const waitingPaymentContent = (
    <React.Fragment>
      <span className="payment-panel__label">
        Send this exact amount of DCR: <b>{amount}</b>
      </span>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span className="payment-panel__label">To this address: </span>
        <div className="address-viewer">
          <span id={"paywall-address"} className="address-viewer_text">
            {paywallAddress}
          </span>
          <div className="address-viewer_menu">
            <Tooltip
              tipStyle={{
                fontSize: "11px",
                top: "20px",
                left: "20px",
                width: "100px"
              }}
              text="Copy address to clipboard"
              position="bottom">
              <span
                className="address-viewer_menu_option fa fa-copy"
                onClick={() => copyToClipboard(paywallAddress)}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <div style={centralizeStyle}>
        <QRCode addr={paywallAddress} />
      </div>
    </React.Fragment>
  );

  const lackingConfirmationsContent = (
    <React.Fragment>
      <span className="payment-panel__label">
        Transaction: <DcrdataTxLink isTestnet={isTestnet} txId={paywallTxid} />
      </span>
    </React.Fragment>
  );

  return (
    <div className="payment-panel">
      {paywallStatus === PAYWALL_STATUS_LACKING_CONFIRMATIONS
        ? lackingConfirmationsContent
        : waitingPaymentContent}
      <div style={centralizeStyle}>
        <Status
          userPaywallStatus={paywallStatus}
          userPaywallConfirmations={paywallConfirmations}
        />
      </div>
    </div>
  );
};

export default PaymentPanel;
