import React from "react";
import Constitution from "../Constitution";

const SidebarTitlebox = () => (
  <div className="spacer">
    <div className="titlebox">
      <form
        action="#"
        className="usertext warn-on-unload"
        id="form-t4_5rve"
      >
        <h1>About Politeia</h1>
        <p>
          Decred is an autonomous digital currency. With a hybrid consensus system,
          it is built to be a decentralized, sustainable, and self-ruling currency
          where stakeholders make the rules.
        </p>

        <p>
          Politeia (Pi) is a censorship-resistant blockchain-anchored public proposal
          system, which empowers users to submit their own projects for self-funding
          from DCR's block subsidy. Pi ensures the ecosystem remains sustainable and
          thrives.
        </p>
        <Constitution className="usertext-body may-blank-within md-container" />
      </form>
      <div className="clear" />
    </div>
  </div>
);

export default SidebarTitlebox;


