import React from "react";
import { CommentArea as CommentAreaBase } from "snew-classic-ui";
import connector from "../../connectors/proposal";

const CommentArea = ({ comments, loggedIn, ...props }) => (
  <CommentAreaBase {...{
    ...props,
    num_comments: comments.length,
    locked: !loggedIn,
    currentSort: "new",
    sortOptions: ["new"]
  }} />
);

export default connector(CommentArea);
