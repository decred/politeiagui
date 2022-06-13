import React from "react";
import RecordWrapper from "../RecordWrapper";
import { useMediaQuery, useTheme, getThemeProperty } from "pi-ui";

import ContentLoader from "react-content-loader";

const ExtraSmallLoader = ({
  primaryColor,
  secondaryColor,
  extended,
  yOffset
}) => (
  <ContentLoader
    height={extended ? 300 : 170}
    width={400}
    speed={2}
    primaryColor={primaryColor}
    secondaryColor={secondaryColor}
  >
    <rect x="0" y="0" width="180" height="10" />
    <rect x="0" y="20" width="360" height="20" />
    <rect x="0" y="60" width="80" height="20" />
    {extended && (
      <>
        <rect x="0" y="100" width="20" height="14" />
        <rect x="30" y="100" width="400" height="14" />
        <rect x="0" y="134" width="400" height="1" />
        <rect x="0" y="154" width="200" height="12" />
        <rect x="0" y="180" width="400" height="12" />
        <rect x="0" y="212" width="400" height="1" />
      </>
    )}
    <rect x="0" y={`${156 + yOffset}`} width="130" height="14" />
    {extended && (
      <>
        <rect x="0" y="220" width="140" height="20" />
        <rect x="150" y="220" width="140" height="20" />
      </>
    )}
  </ContentLoader>
);

const RegularLoader = ({ primaryColor, secondaryColor, extended, yOffset }) => (
  <ContentLoader
    height={extended ? 240 : 100}
    width={800}
    speed={2}
    primaryColor={primaryColor}
    secondaryColor={secondaryColor}
  >
    <rect x="0" y="0" width="600" height="20" />
    <rect x="700" y="0" width="100" height="20" />
    <rect x="0" y="40" width="100" height="10" />
    <rect x="110" y="40" width="200" height="10" />
    {extended && (
      <>
        <rect x="0" y="60" width="20" height="14" />
        <rect x="30" y="60" width="500" height="14" />
        <rect x="0" y="100" width="800" height="1" />
        <rect x="0" y="120" width="600" height="12" />
        <rect x="0" y="136" width="800" height="12" />
        <rect x="0" y="164" width="800" height="1" />
      </>
    )}
    <rect x="0" y={`${80 + yOffset}`} width="130" height="14" />
    {extended && (
      <>
        <rect x="0" y="220" width="140" height="20" />
        <rect x="150" y="220" width="140" height="20" />
      </>
    )}
  </ContentLoader>
);

const ProposalLoader = ({ extended }) => {
  const extraSmall = useMediaQuery("(max-width: 560px)");
  const yOffset = extended ? 100 : 0;
  const { theme } = useTheme();
  const primaryColor = getThemeProperty(theme, "card-background");
  const secondaryColor = getThemeProperty(theme, "dimmed-card-background");
  return (
    <RecordWrapper>
      {() =>
        extraSmall ? (
          <ExtraSmallLoader
            {...{ primaryColor, secondaryColor, extended, yOffset }}
          />
        ) : (
          <RegularLoader
            {...{ primaryColor, secondaryColor, extended, yOffset }}
          />
        )
      }
    </RecordWrapper>
  );
};

export default ProposalLoader;
