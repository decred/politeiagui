import React from "react";
import {
  getThemeProperty,
  useHover,
  useTheme,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import PropTypes from "prop-types";
import IconButton from "src/components/IconButton";
import CopyToClipboard from "src/components/CopyToClipboard";

const CopyLink = ({ url, className }) => {
  const { theme, themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const hoverColor = getThemeProperty(theme, "icon-hover-color");
  const darkIconColor = getThemeProperty(theme, "text-color");
  const [ref, isHovered] = useHover();
  const iconColor = isHovered
    ? hoverColor
    : isDarkTheme
    ? darkIconColor
    : undefined;
  return (
    <CopyToClipboard value={url} tooltipText="Copy link" className={className}>
      {({ onCopyToClipboard }) => (
        <IconButton
          ref={ref}
          iconColor={iconColor}
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
