import React from "react";
import PropTypes from "prop-types";
import { recordComments } from "../comments/comments";

export const RecordComments = ({ token }) => {
  const { comments } = recordComments.useFetch({ token });

  return <div>{comments && JSON.stringify(comments, null, "\n\n")}</div>;
};

RecordComments.propTypes = {
  token: PropTypes.string.isRequired,
};
