import React from "react";
import { useMediaQuery, useTheme, getThemeProperty } from "pi-ui";
import ContentLoader from "react-content-loader";

const CommentLoader = () => {
  const { theme } = useTheme();

  const primaryColor = getThemeProperty(theme, "card-background");
  const secondaryColor = getThemeProperty(theme, "dimmed-card-background");
  const extraSmall = useMediaQuery("(max-width: 560px)");
  return (
    <ContentLoader
      height={100}
      width={extraSmall ? 400 : 600}
      speed={2}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    >
      <rect
        x="0"
        y="10"
        rx="3"
        ry="3"
        width={extraSmall ? "300" : "100"}
        height="16"
      />
      <rect
        x="0"
        y="36"
        rx="4"
        ry="4"
        width={extraSmall ? "400" : "600"}
        height="12"
      />
      <rect
        x="0"
        y="52"
        rx="4"
        ry="4"
        width={extraSmall ? "400" : "600"}
        height="12"
      />
      <rect
        x="0"
        y="74"
        rx="3"
        ry="3"
        width={extraSmall ? "120" : "76"}
        height="16"
      />
    </ContentLoader>
  );
};

export default CommentLoader;
