import React from "react";
import PropTypes from "prop-types";
import DownloadJSON from "src/components/DownloadJSON";
import { useDownloadComments } from "./hooks";
import { useLoader } from "src/containers/Loader";

const DownloadComments = ({ recordToken, className }) => {
  const { comments } = useDownloadComments(recordToken);
  const { apiInfo } = useLoader();
  return (
    !!comments &&
    !!comments.length && (
      <DownloadJSON
        label="Download Comments Bundle"
        fileName={`${recordToken}-comments`}
        content={comments.map(c => ({
          ...c, 
          serverpublickey: apiInfo.pubkey 
        }))}
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
