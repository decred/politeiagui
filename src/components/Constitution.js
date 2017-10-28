import React from "react";
import Markdown from "./snew/Markdown";

const constitution = `
# Decred Constitution

---

*Decred* (/ˈdi:ˈkred/, /dɪˈkred/, dee-cred) is an open, progressive, and self-funding cryptocurrency with a system of community-based governance integrated into its blockchain. The project mission is to develop technology for the public benefit, with a primary focus on cryptocurrency technology. *Decred*, as a currency and as a project, is bound by the following set of rules, which include guiding principles, a system of governance, and a funding mechanism. These rules have been established in an effort to create an equitable and sustainable framework within which to achieve *Decred*'s goals.

---

## Principles

* *Free and Open-Source Software* - All software developed as part of *Decred* shall be free and open source-software.
* *Free Speech and Consideration* - Everyone has the right to communicate opinions and ideas without fear of censorship. Consideration shall be given to all constructive speech that is based in fact and reason.
* *Multi-Stakeholder Inclusivity* - Inclusivity represents a multi-stakeholder system and an active effort shall be maintained to include a diverse set of views and users. While it would be ideal to include everyone, *Decred* shall comply with all relevant bodies of law in the jurisdictions where applicable, such as embargoes and other trade sanctions.
* *Incremental Privacy and Security* - Privacy and security are priorities and shall be balanced with the complexity of their implementations. Additional privacy and security technology shall be implemented on a continuing and incremental basis, both proactively and on-demand in response to attacks.
* *Fixed Finite Supply* - Issuance is finite and the total maximum number of coins in *Decred* shall not change. The total maximum supply for *Decred* is 20,999,999.99800912 coins, with a per-block subsidy that adjusts every 6,144 blocks (approximately 21.33 days) by reducing by a factor of 100/101. The genesis block subsidy starts at 31.19582664 coins.
* *Universal Fungibility* - Universal fungibility is fundamental to *Decred* being a store of value and attacks against it shall be actively monitored and countermeasures pursued as necessary.

---

## Blockchain Governance

* Governance of the network occurs directly through the blockchain via hybridization of a block's proof-of-work ("PoW") with its proof-of-stake ("PoS"). PoS contributors, known as stakeholders, can effectively override PoW contributors, known as miners, if 60% or more of the stakeholders vote against a particular block created by a miner.
* A lottery system is used to determine which stakeholders vote on each block and collect a subsidy.
* To be a stakeholder, one must purchase one or more tickets, which entails locking a specified amount of coins for approximately 1 day (256 blocks).
* After waiting for the ticket to mature, the ticket is entered into a lottery that runs once per block where the winning tickets gain the ability to vote on the previous block.
* Stakeholders must wait an average of 28 days (8,192 blocks) to vote their tickets, and during this time the coins used to purchase the ticket remain locked. The wait may be much longer or shorter than the average of 28 days because the ticket selection process is pseudorandom. Tickets expire after approximately 142 days (40,960 blocks).
* Stakeholder votes recorded in the blockchain are rewarded with 6% of each block subsidy, and each block can have up to 5 votes for a total of 30% of each block subsidy.
* PoW receives 60% of each block subsidy, subject to the constraint that their subsidy scales linearly with the number of PoS votes included, e.g. including 3 of 5 votes reduces PoW subsidy to 60% of the maximum.
* The votes themselves decide by majority decision whether the general transaction tree of the previous block, including the PoW subsidy, is valid. Thus, if PoS voters vote against a particular PoW block, it destroys the PoW subsidy (and development subsidy) and invalidates any regular transactions within that block.
* Additional vote bits may be set when stakeholders submit votes, allowing stakeholders to vote on matters besides the previous block.

[more](https://docs.decred.org/getting-started/constitution/)

`;

const Constitution = (props) => <Markdown body={constitution} {...props} />;
export default Constitution;
