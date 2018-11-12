import React from "react";
import Markdown from "./snew/Markdown";
import modalConnector from "../connectors/modal";
import { ONBOARD } from "./Modal/modalTypes";
import PaywallAlert from "./Paywall/PaywallAlert";
import UserBadge from "./UserBadge";

const aboutText = `
# About Politeia

Decred is an autonomous digital currency. With a hybrid consensus system,
it is built to be a decentralized, sustainable, and self-ruling currency
where stakeholders make the rules.

Politeia (Pi) is a censorship-resistant blockchain-anchored public proposal
system, which empowers users to submit their own projects for self-funding
from DCR's block subsidy. Pi ensures the ecosystem remains sustainable and
thrives.
`;

const resourcesText = `
## Resources

 * [Website](https://decred.org/) & [Blog](https://blog.decred.org/)
 * [Politeia blog post](https://blog.decred.org/2017/10/25/Politeia/)
 * [Decred Constitution](https://docs.decred.org/getting-started/constitution/)
 * [Whitepaper/Technical Brief (pdf)](https://decred.org/dtb001.pdf)
 * [Documentation](https://docs.decred.org/)
 * [Getting Started](https://decred.org/#guide)
 * [Source Code on Github](https://github.com/decred/)
 * [Network Status](https://stats.decred.org/) & [Block Explorer](https://mainnet.decred.org/)
 * [Voting Status](https://voting.decred.org/)
 * [Downloads Overview](https://decred.org/downloads/)
`;

const SidebarText = props => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <UserBadge />
    <PaywallAlert />
    <Markdown
      body={aboutText}
      filterXss={false}
      confirmWithModal={null}
      displayExternalLikWarning={false}
      {...props}
    />
    <span
      style={{ cursor: "pointer", color: "#2971FF" }}
      onClick={e => {
        e.preventDefault();
        props.openModal(ONBOARD);
      }}
    >
      Learn More about Politeia
    </span>
    <Markdown
      body={resourcesText}
      filterXss={false}
      displayExternalLikWarning={false}
      {...props}
    />
  </div>
);
export default modalConnector(SidebarText);
