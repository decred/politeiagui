import React from "react";
import QRCode from "./QRCode";

const copyToClipboard = str => {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const AddressViewer = ({ paywallAddress }) => {
  return (
    <div style={{ display: "flex",  alignItems: "center", justifyContent: "center" }}>
      <div className="address-viewer">
        <div className="address-viewer_menu">
          <span
            className="address-viewer_menu_option fa fa-copy"
            onClick={() => copyToClipboard(paywallAddress)}
          ></span>
        </div>
        <span id={"paywall-address"} className="address-viewer_text">
          {paywallAddress}
        </span>
      </div>
      <QRCode addr={paywallAddress} />
    </div>
  );
};

export default AddressViewer;
