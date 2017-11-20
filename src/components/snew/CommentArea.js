import React from "react";
import { CommentArea as CommentAreaBase } from "snew-classic-ui";
import connector from "../../connectors/proposal";
import { PROPOSAL_STATUS_CENSORED, PROPOSAL_STATUS_UNREVIEWED } from "../../constants";


const CommentArea = ({ comments, loggedIn, proposal, ...props }) => (
  Object.keys(proposal).length === 0 ||
  proposal.status === PROPOSAL_STATUS_UNREVIEWED ||
  proposal.status === PROPOSAL_STATUS_CENSORED ? null :
    <CommentAreaBase {...{
      ...props,
      locked: !loggedIn,
      num_comments: comments.length,
      currentSort: "new",
      sortOptions: ["new"]
    }} />
);

export default connector(CommentArea);
