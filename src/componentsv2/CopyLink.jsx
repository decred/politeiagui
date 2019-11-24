import React, { useContext } from "react";
import { getThemeProperty, useHover, ThemeContext } from "pi-ui";
import PropTypes from "prop-types";
import IconButton from "src/componentsv2/IconButton";
import CopyToClipboard from "src/componentsv2/CopyToClipboard";

const CopyLink = ({ url, className }) => {
  const { currentTheme } = useContext(ThemeContext);
  const hoverColor = getThemeProperty(currentTheme, "color-gray");
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
