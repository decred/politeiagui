import React from "react";
import PropTypes from "prop-types";
import { commentsHooks } from "../comments";
import { Button, Link } from "pi-ui";

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
}) => {
  const { onFetchTimestamps } = commentsHooks.useTimestamps({
    token,
    initialFetch,
    commentids,
  });

  return mode === "button" ? (
    <ButtonComponent onClick={onFetchTimestamps} />
  ) : (
    <LinkComponent onClick={onFetchTimestamps} />
  );
};

DownloadCommentsTimestamps.propTypes = {
  token: PropTypes.string.isRequired,
  commentids: PropTypes.arrayOf(PropTypes.number).isRequired,
  mode: PropTypes.oneOf(["button", "link"]),
  initialFetch: PropTypes.bool,
};

DownloadCommentsTimestamps.defaultProps = {
  mode: "button",
  onFetchDone: () => {},
  initialFetch: false,
};

export default DownloadCommentsTimestamps;
