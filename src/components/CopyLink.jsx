import React from "react";
import { ButtonIcon } from "pi-ui";
import PropTypes from "prop-types";
import CopyToClipboard from "src/components/CopyToClipboard";

const CopyLink = ({ url, className }) => {
  return (
    <CopyToClipboard value={url} tooltipText="Copy link" className={className}>
      {({ onCopyToClipboard }) => (
        <ButtonIcon type="link" onClick={onCopyToClipboard} />
      )}
    </CopyToClipboard>
  );
};

CopyLink.propTypes = {
  url: PropTypes.string
};

export default CopyLink;
