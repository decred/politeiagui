import React from "react";
import PropTypes from "prop-types";
import { commentsHooks } from "../comments";

const RecordComments = ({ token }) => {
  const { comments } = commentsHooks.useComments({ token, initialFetch: true });

  return <div>{comments && JSON.stringify(comments, null, "\n\n")}</div>;
};

RecordComments.propTypes = {
  token: PropTypes.string.isRequired,
};

export default RecordComments;
