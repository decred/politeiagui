import React from "react";
import PropTypes from "prop-types";
import DownloadJSON from "src/componentsv2/DownloadJSON";
import { useDownloadComments } from "./hooks";

const DownloadComments = ({ recordToken, className }) => {
  const { comments } = useDownloadComments(recordToken);
  return (
    !!comments &&
    !!comments.length && (
      <DownloadJSON
        label="Download Comments Bundle"
        fileName={`${recordToken}-comments`}
        content={comments}
        className={className}
      />
    )
  );
};

DownloadComments.propTypes = {
  recordToken: PropTypes.string,
  className: PropTypes.string
};

export default DownloadComments;
