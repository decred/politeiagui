import React from "react";
import PropTypes from "prop-types";
import { recordComments } from "../../comments/comments";
import { Button } from "pi-ui";
import { downloadJson } from "./utils";

export function DownloadCommentsBundle({ token, mode, label }) {
  const { comments } = recordComments.useFetch({ token });

  function handleDownload() {
    downloadJson(Object.values(comments), `${token}-comments-bundle`);
  }

  return {
    button: <Button onClick={handleDownload}>{label}</Button>,
    text: <span onClick={handleDownload}>{label}</span>,
  }[mode];
}

DownloadCommentsBundle.propTypes = {
  token: PropTypes.string.isRequired,
  commentids: PropTypes.arrayOf(PropTypes.number),
  mode: PropTypes.oneOf(["button", "text"]),
  label: PropTypes.string,
};
DownloadCommentsBundle.defaultProps = {
  mode: "button",
};
