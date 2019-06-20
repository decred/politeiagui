import React from "react";
import { Sidebar as UISidebar, Button, Card } from "pi-ui";
import { withRouter } from "react-router-dom";
import LoggedInContent from "./LoggedInContent";
import StaticMarkdown from "./StaticMarkdown";
import { useConfig } from "src/Config";

const Sidebar = ({ history }) => {
  const { aboutContent } = useConfig();
  return (
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
        <StaticMarkdown contentName={aboutContent} />
      </Card>
    </UISidebar>
  );
};

export default withRouter(Sidebar);
