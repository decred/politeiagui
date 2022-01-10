import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { commentsHooks } from "../comments";
import { Button, Link } from "pi-ui";
import isEmpty from "lodash/fp/isEmpty";
import range from "lodash/range";
import fileDownload from "js-file-download";

const ButtonComponent = (props) => <Button {...props}>Fetch Timestamps</Button>;

const LinkComponent = (props) => (
  <Link href="" {...props}>
    Fetch Timestamps
  </Link>
);

const DownloadCommentsTimestamps = ({
  token,
  mode,
  initialFetch,
  commentids,
  pageSize,
}) => {
  const { count, countStatus } = commentsHooks.useCount({
    tokens: [token],
    initialFetch,
  });
  const commentsCount = count[token];
  const { onFetchTimestamps, timestamps, timestampsStatus } =
    commentsHooks.useTimestamps({
      token,
      initialFetch,
      commentids: !isEmpty(commentids)
        ? commentids
        : range(1, commentsCount + 1),
      pageSize,
    });

  const handleFetchTimestamps = () => {
    if (timestampsStatus === "succeeded/isDone") {
      fileDownload(JSON.stringify(timestamps), `${token}-comments-timestamps`);
    } else if (timestampsStatus === "idle") {
      onFetchTimestamps();
    }
  };

  useEffect(() => {
    if (timestampsStatus === "succeeded/isDone") {
      fileDownload(JSON.stringify(timestamps), `${token}-comments-timestamps`);
    }
  }, [timestamps, timestampsStatus, token]);

  return countStatus === "succeeded" ? (
    mode === "button" ? (
      <ButtonComponent onClick={handleFetchTimestamps} />
    ) : (
      <LinkComponent onClick={handleFetchTimestamps} />
    )
  ) : (
    "Loading"
  );
};

DownloadCommentsTimestamps.propTypes = {
  token: PropTypes.string.isRequired,
  commentids: PropTypes.arrayOf(PropTypes.number),
  mode: PropTypes.oneOf(["button", "link"]),
  initialFetch: PropTypes.bool,
  pageSize: PropTypes.number,
};

DownloadCommentsTimestamps.defaultProps = {
  mode: "button",
  onFetchDone: () => {},
  initialFetch: false,
  pageSize: 100,
};

export default DownloadCommentsTimestamps;
