import React from "react";
import { CommentArea as CommentAreaBase } from "snew-classic-ui";
import connector from "../../connectors/proposal";

const CommentArea = ({ comments, loggedIn, proposal, ...props }) => (
  !loggedIn || proposal.status === 2 || proposal.status === 3 ? null :
    <CommentAreaBase {...{
      ...props,
      num_comments: comments.length,
      currentSort: "new",
      sortOptions: ["new"]
    }} />
);

export default connector(CommentArea);
