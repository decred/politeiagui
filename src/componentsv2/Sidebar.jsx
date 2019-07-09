import { Card, Sidebar as UISidebar } from "pi-ui";
import React, { useMemo } from "react";
import { useConfig } from "src/Config";
import PaywallMessage from "./PaywallMessage";
import StaticMarkdown from "./StaticMarkdown";

const Sidebar = () => {
  const { aboutContent, paywallContent } = useConfig();
  return useMemo(
    () => (
      <UISidebar>
        <PaywallMessage />
        <Card paddingSize="small">
          <StaticMarkdown contentName={aboutContent} />
        </Card>
      </UISidebar>
    ),
    [aboutContent, paywallContent]
  );
};

export default Sidebar;
