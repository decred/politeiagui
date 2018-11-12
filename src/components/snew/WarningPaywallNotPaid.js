import React from "react";

const WarningPaywallNotPaid = ({ message }) => (
  <div className="spacer">
    <div className="titlebox">
      <form action="#" className="usertext warn-on-unload" id="form-t4_5rve">
        <p>{message}</p>
      </form>
      <div className="clear" />
    </div>
  </div>
);

export default WarningPaywallNotPaid;
