import React from "react";
import { getThemeProperty, useHover, useTheme } from "pi-ui";
import PropTypes from "prop-types";
import IconButton from "src/componentsv2/IconButton";
import CopyToClipboard from "src/componentsv2/CopyToClipboard";

const CopyLink = ({ url, className }) => {
  const { theme, themeName } = useTheme();
  const isDarkTheme = themeName === "dark";
  const hoverColor = getThemeProperty(theme, "icon-hover-color");
  const darkIconColor = getThemeProperty(theme, "text-color");
  const [ref, isHovered] = useHover();
  const iconColor = isHovered ? hoverColor : isDarkTheme ? darkIconColor : undefined;
  return (
    <CopyToClipboard value={url} tooltipText="Copy link">
      {({ onCopyToClipboard }) => (
        <IconButton
          ref={ref}
          iconColor={iconColor}
          className={className}
          type="link"
          onClick={onCopyToClipboard}
        />
      )}
    </CopyToClipboard>
  );
};

CopyLink.propTypes = {
  url: PropTypes.string
};

export default CopyLink;
