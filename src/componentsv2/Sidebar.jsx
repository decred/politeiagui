import React from "react";
import { Sidebar as UISidebar, Button, Card, H2, P } from "pi-ui";
import { withRouter } from "react-router-dom";
import LoggedInContent from "./LoggedInContent";

const Sidebar = ({ history }) => (
  <UISidebar>
    <LoggedInContent>
      <Button
        className="margin-bottom-s"
        onClick={() => history.push(`/proposals/new`)}
        fullWidth
      >
        Submit Proposal
      </Button>
    </LoggedInContent>
    <Card paddingSize="small">
      <H2>About Politeia</H2>
      <P className="margin-top-s">
        Decred is an autonomous digital currency. With a hybrid consensus
        system, it is built to be a decentralized, sustainable, and self-ruling
        currency where stakeholders make the rules.
      </P>
      <P>
        Politeia (Pi) is a censorship-resistant blockchain-anchored public
        proposal system, which empowers users to submit their own projects for
        self-funding from DCR’s block subsidy. Pi ensures the ecosystem remains
        sustainable and thrives.
      </P>
    </Card>
  </UISidebar>
);

export default withRouter(Sidebar);
