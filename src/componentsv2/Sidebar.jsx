import { Button, Card, Sidebar as UISidebar } from "pi-ui";
import React from "react";
import { withRouter } from "react-router-dom";
import { useConfig } from "src/Config";
import LoggedInContent from "./LoggedInContent";
import StaticMarkdown from "./StaticMarkdown";

const Sidebar = ({ history }) => {
  const { aboutContent } = useConfig();
  return (
    <UISidebar>
      <LoggedInContent>
        <Button
          className="margin-bottom-s"
          onClick={() => history.push("/proposals/new")}
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
