import React from "react";
import PropTypes from "prop-types";
import DownloadJSON from "src/components/DownloadJSON";
import { useDownloadComments } from "./hooks";
import { useLoader } from "src/containers/Loader";

const DownloadComments = ({ recordToken, className, label }) => {
  const { comments } = useDownloadComments(recordToken);
  const { apiInfo } = useLoader();

  return !!comments && !!comments.length ? (
    <DownloadJSON
      label={label}
      fileName={`${recordToken}-comments`}
      content={{
        ...comments,
        serverpublickey: apiInfo.pubkey
      }}
      className={className}
    />
  ) : null;
};

DownloadComments.propTypes = {
  recordToken: PropTypes.string,
  className: PropTypes.string,
  isTimestamp: PropTypes.bool
};
DownloadComments.defaultProps = {
  isTimestamp: false,
  state: 0,
  label: "Download Comments Bundle"
};

export default DownloadComments;
