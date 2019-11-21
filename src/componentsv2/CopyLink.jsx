import React from "react";
import { getThemeProperty, useHover, useTheme } from "pi-ui";
import PropTypes from "prop-types";
import IconButton from "src/componentsv2/IconButton";
import CopyToClipboard from "src/componentsv2/CopyToClipboard";

const CopyLink = ({ url, className }) => {
  const [theme] = useTheme();
  const hoverColor = getThemeProperty(theme, "color-gray");
  const [ref, isHovered] = useHover();
  const iconColor = isHovered ? hoverColor : undefined;
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
