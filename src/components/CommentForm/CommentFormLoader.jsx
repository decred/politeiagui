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
      <rect x="0" y="30" width="800" height="200" />
      <rect x="630" y="250" width="170" height="50" />
    </ContentLoader>
  );
};

export default ProposalFormLoader;
