import React from "react";
import ContentLoader from "react-content-loader";
import { useTheme, getThemeProperty } from "pi-ui";

const ProposalFormLoader = () => {
  const { theme } = useTheme();
  const primaryColor = getThemeProperty(theme, "card-background");
  const secondaryColor = getThemeProperty(theme, "dimmed-card-background");
  return (
    <ContentLoader
      height={420}
      width={800}
      speed={2}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    >
      <rect x="0" y="10" width="800" height="40" />

      <rect x="0" y="75" width="800" height="1" />

      <rect x="0" y="100" width="800" height="150" />

      <rect x="0" y="280" width="800" height="1" />
      <rect x="0" y="310" width="130" height="14" />
      <rect x="150" y="310" width="130" height="14" />
      <rect x="500" y="360" width="140" height="40" />
      <rect x="650" y="360" width="140" height="40" />
    </ContentLoader>
  );
};

export default ProposalFormLoader;
