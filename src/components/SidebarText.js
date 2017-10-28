import React from "react";
import Markdown from "./snew/Markdown";

const text = `
# About Politeia

Decred is an autonomous digital currency. With a hybrid consensus system,
it is built to be a decentralized, sustainable, and self-ruling currency
where stakeholders make the rules.

Politeia (Pi) is a censorship-resistant blockchain-anchored public proposal
system, which empowers users to submit their own projects for self-funding
from DCR's block subsidy. Pi ensures the ecosystem remains sustainable and
thrives.

[Read  more](https://blog.decred.org/2017/10/25/Politeia/)

## Resources

 * [Website](https://decred.org/) & [Blog](https://blog.decred.org/)
 * [Decred Constitution](https://docs.decred.org/getting-started/constitution/)
 * [Whitepaper/Technical Brief (pdf)](https://coss.io/documents/white-papers/decred.pdf)
 * [Documentation](https://docs.decred.org/)
 * [Getting Started](https://decred.org/#guide)
 * [Source Code on Github](https://github.com/decred/)
 * [Network Status](https://stats.decred.org/) & [Block Explorer](https://mainnet.decred.org/)
 * [Voting Status](https://voting.decred.org/)
 * [Downloads Overview](https://decred.org/downloads/)
`;

const SidebarText = (props) => <Markdown body={text} {...props} />;
export default SidebarText;
