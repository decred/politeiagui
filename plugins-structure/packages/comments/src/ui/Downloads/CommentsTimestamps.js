import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { commentsTimestamps } from "../../comments/timestamps";
import { Button } from "pi-ui";
import { downloadJson } from "./utils";

export const DownloadCommentsTimestamps = ({
  token,
  mode,
  label,
  commentids,
}) => {
  const [allowDownload, setAllowDownload] = useState(false);
  const { onFetchTimestamps, timestamps, timestampsStatus } =
    commentsTimestamps.useFetch({ token, commentids });

  const handleFetchTimestamps = () => {
    if (timestampsStatus === "succeeded/isDone") {
      downloadJson(timestamps, `${token}-comments-timestamps`);
    } else if (timestampsStatus === "idle") {
      onFetchTimestamps();
      setAllowDownload(true);
    }
  };

  useEffect(() => {
    if (timestampsStatus === "succeeded/isDone" && allowDownload) {
      downloadJson(timestamps, `${token}-comments-timestamps`);
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
  label: PropTypes.string,
};

DownloadCommentsTimestamps.defaultProps = {
  mode: "button",
  label: "Download Comments Timestamps",
};
