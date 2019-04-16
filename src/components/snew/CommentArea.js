import React from "react";
import Select from "react-select";
import { CommentArea as CommentAreaBase } from "snew-classic-ui";
import proposalConnector from "../../connectors/proposal";
import { TOP_LEVEL_COMMENT_PARENTID } from "../../lib/api";
import {
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_UNREVIEWED,
  SORT_BY_TOP,
  SORT_BY_OLD,
  SORT_BY_NEW,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  INVOICE_STATUS_INVALID,
  INVOICE_STATUS_NOTFOUND
} from "../../constants";
import {
  setQueryStringValue,
  getQueryStringValue
} from "../../lib/queryString";

class CommentArea extends React.Component {
  componentDidMount() {
    const { comments } = this.props;
    // see if the comment parameter is in the query string if it is the page is
    // scrolled to the top of the comments area
    const scrollToComments = getQueryStringValue("comments");
    if (comments && scrollToComments) {
      this.scrollToCommentArea();
    }

    // get the comment sort option from the query string. If it specified
    // and valid, the sort option should be changed.
    const sort = getQueryStringValue("sort");
    const validSortOptionFromQueryString =
      sort && [SORT_BY_NEW, SORT_BY_OLD, SORT_BY_TOP].find(o => o === sort);
    if (validSortOptionFromQueryString) {
      this.props.onSetCommentsSortOption({ value: sort, label: sort });
    }
  }
  scrollToCommentArea = () => {
    const el = document.getElementsByClassName("commentarea")[0];
    window.scrollTo(0, 0);
    if (el && el.scrollIntoView) {
      el.scrollIntoView();
      const additionalHeightToBypassHeader = 100;
      window.scrollTo(0, window.scrollY - additionalHeightToBypassHeader);
    }
  };
  onSetCommentsSortOption = option => {
    // set the coment option in the query string
    setQueryStringValue("sort", option.value);

    // set the comment option in the app state
    this.props.onSetCommentsSortOption(option);
  };
  render() {
    const {
      comments,
      loggedInAsEmail,
      record: proposal,
      commentsSortOption,
      commentid,
      onViewAllClick,
      token,
      numofcomments,
      invoice,
      ...props
    } = this.props;
    const hideComments =
      (Object.keys(proposal).length === 0 ||
        proposal.status === PROPOSAL_STATUS_UNREVIEWED ||
        proposal.status === PROPOSAL_STATUS_UNREVIEWED_CHANGES ||
        proposal.status === PROPOSAL_STATUS_CENSORED) &&
      (Object.keys(invoice).length === 0 ||
        invoice.status === INVOICE_STATUS_INVALID ||
        invoice.status === INVOICE_STATUS_NOTFOUND);
    return hideComments ? null : (
      <CommentAreaBase
        {...{
          ...props,
          singleThread: commentid ? (
            <span>
              Single comment thread.{" "}
              <a
                href={!props.isCMS ? `proposals/${token}` : `invoices/${token}`}
                onClick={onViewAllClick}
              >
                View all
              </a>
            </span>
          ) : null,
          locked: !loggedInAsEmail,
          name: TOP_LEVEL_COMMENT_PARENTID,
          num_comments: numofcomments,
          SorterComponent: () =>
            comments && numofcomments > 0 ? (
              <div className="comments-sort">
                <span className="">Sort by:</span>
                <Select
                  onKeyDown={e => e.keyCode === 8 && e.preventDefault()}
                  classNamePrefix="sort-select"
                  isSearchable={false}
                  isClearable={false}
                  escapeClearsValue={false}
                  value={commentsSortOption}
                  onChange={this.onSetCommentsSortOption}
                  options={[SORT_BY_NEW, SORT_BY_OLD, SORT_BY_TOP].map(op => ({
                    value: op,
                    label: op
                  }))}
                />
              </div>
            ) : null,
          hideSortOptions: false
        }}
      />
    );
  }
}

export default proposalConnector(CommentArea);
