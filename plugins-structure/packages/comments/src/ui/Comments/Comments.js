import React from "react";
import PropTypes from "prop-types";
import { CommentCard } from "../CommentCard";

export const Comments = ({ comments }) => {
  console.log("comments", comments);

  return Object.values(comments).map((c) => <CommentCard comment={c} />);
};

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
};
