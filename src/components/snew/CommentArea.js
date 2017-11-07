import React from "react";
import { CommentArea as CommentAreaBase } from "snew-classic-ui";
import connector from "../../connectors/proposal";

const CommentArea = ({ comments, ...props }) => (
  <CommentAreaBase {...{ ...props, num_comments: comments.length }} />
);

export default connector(CommentArea);
