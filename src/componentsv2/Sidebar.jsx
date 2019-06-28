import { Card, Sidebar as UISidebar } from "pi-ui";
import React from "react";
import { useConfig } from "src/Config";
import StaticMarkdown from "./StaticMarkdown";

const Sidebar = () => {
  const { aboutContent } = useConfig();
  return (
    <UISidebar>
      <Card paddingSize="small">
        <StaticMarkdown contentName={aboutContent} />
      </Card>
    </UISidebar>
  );
};

export default Sidebar;
