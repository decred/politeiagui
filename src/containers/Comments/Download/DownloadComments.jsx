import React from "react";
import PropTypes from "prop-types";
import DownloadJSON from "src/components/DownloadJSON";
import { useDownloadComments } from "./hooks";
import { useLoader } from "src/containers/Loader";

const DownloadComments = ({
  recordToken,
  className,
  isTimestamp,
  state,
  label
}) => {
  const { comments, onFetchCommentsTimestamps } = useDownloadComments(
    recordToken
  );
  const { apiInfo } = useLoader();
  return !!comments && !!comments.length ? (
    !isTimestamp ? (
      <DownloadJSON
        label={label}
        fileName={`${recordToken}-comments`}
        content={comments.map((c) => ({
          ...c,
          serverpublickey: apiInfo.pubkey
        }))}
        className={className}
      />
    ) : (
      <DownloadJSON
        label={label}
        isAsync={true}
        fileName={`timestamp-${
          recordToken ? recordToken.substring(0, 7) : ""
        }-comments`}
        beforeDownload={() => onFetchCommentsTimestamps(recordToken, state)}
        content={[]}
      />
    )
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
