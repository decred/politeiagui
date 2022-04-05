import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { commentsTimestamps } from "../../comments/timestamps";
import { Button } from "pi-ui";
import fileDownload from "js-file-download";

export const DownloadCommentsTimestamps = ({
  token,
  mode,
  label = "Download Comments Timestamps",
  commentids,
  pageSize,
}) => {
  const [allowDownload, setAllowDownload] = useState(false);
  const { onFetchTimestamps, timestamps, timestampsStatus } =
    commentsTimestamps.useFetch({ token, commentids, pageSize });

  const handleFetchTimestamps = () => {
    if (timestampsStatus === "succeeded/isDone") {
      fileDownload(
        JSON.stringify(timestamps, null, 2),
        `${token}-comments-timestamps.json`
      );
    } else if (timestampsStatus === "idle") {
      onFetchTimestamps();
      setAllowDownload(true);
    }
  };

  useEffect(() => {
    if (timestampsStatus === "succeeded/isDone" && allowDownload) {
      fileDownload(
        JSON.stringify(timestamps, null, 2),
        `${token}-comments-timestamps.json`
      );
    }
  }, [timestamps, timestampsStatus, token, allowDownload]);

  return {
    button: <Button onClick={handleFetchTimestamps}>{label}</Button>,
    text: <span onClick={handleFetchTimestamps}>{label}</span>,
  }[mode];
};

DownloadCommentsTimestamps.propTypes = {
  token: PropTypes.string.isRequired,
  commentids: PropTypes.arrayOf(PropTypes.number),
  mode: PropTypes.oneOf(["button", "text"]),
  pageSize: PropTypes.number,
};

DownloadCommentsTimestamps.defaultProps = {
  mode: "button",
  onFetchDone: () => {},
  pageSize: 100,
};
