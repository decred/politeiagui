import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import { Tabs, Tab } from "../../Tabs";
import Markdown from "../../snew/Markdown";
import get from "lodash/fp/get";

class OnBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: get([ "me", "payload", "tab" ], this.props) || 0
    };
  }
  render() {
    const { closeModal } = this.props;
    const { tab } = this.state;
    const contentWrapperStyle = {
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      height: "calc(100% - 103px)"
    };
    const bodyWrapperStyle = {
      padding: "10px",
      overflow: "auto",
      flex: "1"
    };
    const buttonsWrapperStyle = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "60px",
      padding: "0 10px 0 10px"
    };

    return (
      <ModalContentWrapper
        title={"Welcome to Politeia!"}
        onClose={closeModal}
        style={{ height: "calc(100vh - 100px)" }}
      >
        <div style={contentWrapperStyle}>
          <Tabs>
            {onBoardingContent.map(
              ({ title }, idx) =>
                <Tab
                  tabId={idx}
                  selected={this.state.tab === idx}
                  onTabChange={() => this.setState({ tab: idx })}
                  title={title}
                />
            )}
          </Tabs>
          <div style={bodyWrapperStyle}>
            <Markdown body={onBoardingContent[this.state.tab].body} />
          </div>
        </div>
        <div style={buttonsWrapperStyle}>
          {tab !== 0 ?
            <button
              className="inverse"
              onClick={() => this.setState({ tab: tab - 1 })}
            >
              ← {onBoardingContent[tab - 1].title}
            </button> : <div></div>
          }
          {tab < onBoardingContent.length - 1 &&
            <button
              className="inverse"
              style={{ margin: 0 }}
              onClick={() => this.setState({ tab: tab + 1 })}
            >
              {onBoardingContent[tab + 1].title} →
            </button>
          }
        </div>
      </ModalContentWrapper>
    );
  }
}


const onBoardingContent = [
  {
    title: "What is Politeia?",
    body: `
**What is Politeia?**


Politeia is a platform that supports Decred’s governance. It facilitates the submission, tracking, and discussion of Decred governance proposals by the stakeholder community.

Decred’s approach to decision-making is grounded in the principle of stakeholder voting. To vote, stakeholders must time-lock DCR to buy tickets. While tickets are live they
can be used to cast a vote for or against each open Politeia proposal.

    `
  },
  {
    title: "Proposals",
    body: `
**Politeia proposals**

There are two types of proposals:

1. Proposals that aim to establish Voter support for a course of action (e.g. adopting or changing some policy).
2. Proposals that commit to spending Project Treasury DCR. These proposals will have a budget, which proposal owners can draw down against as they demonstrate progress towards the proposal's aim.

To prevent proposal spamming, there is a 0.1 DCR fee for submitting a proposal. There is also a 0.1 DCR fee for registering a Politeia account, to limit comment spam and up/down voting sock-puppetry. Fees may be altered in the future if they are determined insufficient to deter spam, or if the price of DCR changes considerably.

Reddit-style **up/down voting** is used for **proposal and comment sorting only**. Up/down votes are not anonymous.

Ticket-voting on proposals doesn’t happen directly on Politeia, but from within a Decred wallet.
`
  },
  {
    title: "Censorship",
    body: `
**Censorship**

Politeia is built around the concept of _transparent censorship_. Users cannot be silently censored. When proposals
are submitted, they are checked by Politeia administrators, and proposals that are deemed spam or invalid will be
censored. If a user believes they have been unfairly censored, they can prove that their proposal was censored using
a “censorship token”; a token automatically generated upon proposal submission using the user’s unique
cryptographic identity (pub/priv key pair). This token can be used to demonstrate to the community that the user's specific
proposal/comment was submitted, the time it was submitted, and in what form.
`
  },
  {
    title: "Submitting and approving proposals",
    body: `
**Submitting and approving proposals**


The basic process for submitting and approving proposals is outlined below. Note that as Politeia is still in an experimental stage,
 this process is subject to change as the system iterates.

1. Submit proposal.
2. Proposal reviewed by Politeia admins, spam is censored.
3. Valid proposals appear publicly on Politeia, open for discussion, but voting does not begin immediately.
4. For now, the ticket-voting interval of 2016 blocks (~1 week) can only be triggered by an admin. Until ticket-voting is triggered, the
proposal can be edited by its owner in response to community feedback.
5. Ticket-voting starts, ticket-holders vote through their wallet.
6. When the ticket-voting period ends, the proposal is formally approved or rejected. Some types of proposal will
require a super-majority. Details like supermajorities and quorum required for different kinds of proposal are to be
determined.
7. When a proposal with a budget and deliverables is approved, work can begin. The proposal owner can submit claims
against that budget as deliverables are completed.
8. Payment claims will be handled manually by Decred Holdings Group until such times as this process can be adequately
decentralized.

Politeia's aim is to serve as the decision-making force behind the Decred Decentralized Autonomous Entity (DAE). This is an ambitious aim.
Because Politeia and its accompanying processes are still in an experimental stage, Politeia will serve initially as a robust
signaling mechanism from Decred shareholders to the community members controlling the project fund wallet. Over time, this will
be iterated towards a DAE that decentralizes the functions currently performed by trusted humans, and the DAE will control the
project fund wallet directly.

For proposals that request funding, an initial set of guidelines and examples has been prepared. Guidelines
for good proposals and policies for censoring proposals will be iterated once Politeia is live.
`
  },
  {
    title: "Proposal guidelines",
    body: `
**Proposal guidelines**
## How to submit a Politeia proposal

When authoring a Politeia proposal, one must answer the following 5 questions:

1. What
2. Why
3. How
4. Who
5. When

Below we present two examples: a proposal for developing a software feature, and a proposal for a marketing initiative.

## Software Feature Example

### What

In the *What* section we try to answer what we are proposing. This should be a
short description of the problem that will be addressed.

    Add monitoring RPC call that can be used for status reporting and as a
    heartbeat to ensure that politeiawww is functioning properly.

### Why

In the *Why* section we try to answer why the proposal is needed and why it is
a good idea.

    Currently there is no prescribed way to remotely determine if politeiawww is
    functioning correctly. We propose to add a single RPC that doubles as the
    heartbeat and a status monitor. The idea is that monitoring software can
    periodically issue the RPC and determine if an alert needs to be sent out to
    the admins.


### How

    1. Design and document RPC.
    2. Add a priviledged RPC called Status that replies with StatusReply.
      * The Status RPC is an empty structure
      * The StatusReply structure returns a tri-state status: OK, Warning,
        Critical. In addition to the status the RPC returns a server message
        that can be forwarded to the administrators in case of Warning or
        Failure.
      * The StatusReply returns interesting statistics such as: number of
        proposals in memory, number of comments in memory etc.
    3. Add refclient unit tests that validate all 3 conditions.
    4. Add RPC to politeiawwwcli so that the status calls can be scripted.

### Who

In the *Who* section, describe the entity that is making the proposal, will
complete the work, and will draw down on the proposal's budget.

### When

In the *When* section we describe the milestones and when they will be delivered.

Create some sort of draw schedule that explains what milestones will be
delivered when. In this example we do the design and documentation first and
finish the work with the implementation of the code.

We allow for some time between the deliverables in order to leave space for a
vote by the stakeholders to see if the first step makes sense. Note that this
is a small example and therefore the timelines are a bit longish. The milestone
votes should be less than a week.

    1. 2 hours to design and add documentation on how to use the call with some
    examples.
    2. 8 hours to add the call, determine what status to set when and figure out
        what statistics to return.
    3. 4 hours to add refclient validation tests.
    4. 2 hours to add RPC to politeiawwwcli

    In addition allow for 1 hour of overhead (going back and forth on slack/github
    etc). This will bring the grand total to 17 hours at a rate of $40/hr. This
    proposal will therefore be capped at $680.

    The proposed schedule is to do this work over 2 weeks in order to allow back
    and forth on the details.

    Week 1 deliverables
    1. Design RPC
    2. Write documentation that includes examples

    2 hours, to be completed on August 15 2018

    Week 2 deliverables
    1. Implement RPC
    2. Implement validation tests
    3. Implement politeiawwwcli

    15 hours, to be completed on August 29 2018

## Marketing Example

###  What

    This proposal would fund a Decred presence at Real Blockchain Conference 2018,
	in Dublin, Ireland, November 11-13. It would cover costs for a booth, swag, and
	people to staff the booth.

### Why

    Real Blockchain Conference is a top cryptocurrency conference and totally not made up.
	Last year's conference had 5,000 attendees and they seemed cool, good solid Decred
	stakeholder material. With epic swag and a physical embodiment of Stakey in attendance,
	a presence at this conference would raise awareness of Decred.

### How (much)

    I will organize Decred's presence at this event, it will take about 20 hours of my time at 40$/hour. $800
    Conference registration/booth fees: $3,000
    Booth decorations: $1,000
    Decred swag to give away: $2,000
    3 staff on the booth for 3 (10 hour) days each at $30/hr: (3 x 3 x 10 x 30) $2,700
    Stakey costume: $500
    Stakey costume occupant: 3 (10 hour) days at $40/hr (that suit is warm!): $1,200
    Travel expenses for booth staff: Up to $2,000
    Accomodation for booth staff. We will stay at the conference hotel costing $200/night, it is unlikely
	that all booth staff need accomodation, but the maximum would be 200 x 3 nights x 4 staff = $2,400

    Maximum total budget: $15,600

### Who

    This proposal is submitted by @AllYourStake (on Slack, /u/StakeGovernor2000 on reddit). You may
	remember me as the organizer of Decred's presence at such blockchain events as Real Blockchain
	Conference 2017 and Buckets of Blockchain 2018.
    I don't know exactly who the 3 booth staff and 1 Stakey suit wearer will be, I will be one of the
	staff and @Contributor1 is also interested.

### When

    Registration fees are due by September 30th, I will pay these up-front and request full reimbursement
	immediately. I will front the cost of the swag and Stakey suit, and claim this along with my
	travel/accomodation expenses and payment for my work, after the event.
    Booth staff who are already Decred contributors will bill for their hours and expenses directly,
	I will serve as intermediary for any staff costs not associated with established contributors.
`
  }
];


export default modalConnector(OnBoard);
