import React from "react";
import Select from "react-select";
import { CommentArea as CommentAreaBase } from "snew-classic-ui";
import connector from "../../connectors/proposal";
import { TOP_LEVEL_COMMENT_PARENTID } from "../../lib/api";
import {
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_UNREVIEWED,
  SORT_BY_TOP,
  SORT_BY_OLD,
  SORT_BY_NEW,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES
} from "../../constants";

const CommentArea = ({
  comments,
  loggedInAsEmail,
  proposal,
  onSetCommentsSortOption,
  commentsSortOption,
  ...props
}) => (
  Object.keys(proposal).length === 0 ||
  proposal.status === PROPOSAL_STATUS_UNREVIEWED ||
  proposal.status === PROPOSAL_STATUS_UNREVIEWED_CHANGES ||
  proposal.status === PROPOSAL_STATUS_CENSORED ? null :
    <CommentAreaBase {...{
      ...props,
      locked: !loggedInAsEmail,
      name: TOP_LEVEL_COMMENT_PARENTID,
      num_comments: comments.length,
      SorterComponent: () => comments && comments.length > 0 ? (
        <div className="comments-sort" >
          <span className="">Sort by:</span>
          <Select
            onKeyDown={(e) => e.keyCode === 8 && e.preventDefault()}
            classNamePrefix="sort-select"
            isSearchable={false}
            isClearable={false}
            escapeClearsValue={false}
            value={commentsSortOption}
            onChange={onSetCommentsSortOption}
            options={[ SORT_BY_NEW, SORT_BY_OLD, SORT_BY_TOP ]
              .map(op => ({ value: op, label: op }))
            }
          />
        </div>
      ) : null,
      hideSortOptions: false
    }} />
);

export default connector(CommentArea);
