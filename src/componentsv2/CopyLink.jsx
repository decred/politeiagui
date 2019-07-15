import React from "react";
import PropTypes from "prop-types";
import IconButton from "src/componentsv2/IconButton";
import CopyToClipboard from "src/componentsv2/CopyToClipboard";

const CopyLink = ({ url, className }) => (
  <CopyToClipboard value={url} tooltipText="Copy link">
    {({ onCopyToClipboard }) => (
      <IconButton
        className={className}
        type="link"
        onClick={onCopyToClipboard}
      />
    )}
  </CopyToClipboard>
);

CopyLink.propTypes = {
  url: PropTypes.string
};

export default CopyLink;
