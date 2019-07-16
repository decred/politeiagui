import React, { useMemo } from "react";
import { Card, Sidebar as UISidebar } from "pi-ui";
import { useConfig } from "src/Config";
import StaticMarkdown from "./StaticMarkdown";

const Sidebar = () => {
  const { aboutContent } = useConfig();
  return useMemo(
    () => (
      <UISidebar>
        <Card paddingSize="small">
          <StaticMarkdown contentName={aboutContent} />
        </Card>
      </UISidebar>
    ),
    [aboutContent]
  );
};

export default Sidebar;
