import React from "react";
import isEqual from "lodash/isEqual";
import { withRouter } from "react-router-dom";
import { Content } from "../snew";
import { commentsToT1, proposalToT3, invoiceToT3 } from "../../lib/snew";
import { getTextFromIndexMd, getTextFromJsonToCsv } from "../../helpers";
import { DEFAULT_TAB_TITLE } from "../../constants";
import Message from "../Message";
import {
  updateSortedComments,
  mergeNewComments,
  getUpdatedComments
} from "./helpers";

class ProposalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedComments: [],
      accessTime: 0
    };
  }
  componentDidUpdate(prevProps) {
    if (
      (prevProps.proposal &&
        this.props &&
        prevProps.proposal.name !== this.props.proposal.name) ||
      this.props.openedModals.length < prevProps.openedModals.length
    ) {
      document.title = this.props.proposal.name;
    }
    if (
      (!prevProps.proposal || Object.keys(prevProps.proposal).length === 0) &&
      this.props.proposal &&
      Object.keys(this.props.proposal).length > 0 &&
      this.props.proposal.status === 4
    ) {
      !prevProps.isCMS && prevProps.onFetchProposalVoteStatus(prevProps.token);
    }
    this.handleUpdateOfComments(prevProps, this.props);
  }
  componentDidMount() {
    !this.props.isCMS && this.props.onFetchLikedComments(this.props.token);
  }

  componentWillUnmount() {
    this.props.resetLastSubmittedProposal();
    document.title = DEFAULT_TAB_TITLE;
  }

  handleUpdateOfComments = (currentProps, nextProps) => {
    let sortedComments;

    if (!nextProps.comments || nextProps.comments.length === 0) {
      return;
    }

    // sort option changed
    if (currentProps.commentsSortOption !== nextProps.commentsSortOption) {
      sortedComments = updateSortedComments(
        this.state.sortedComments,
        nextProps.commentsSortOption
      );
    }

    // new comment added
    if (currentProps.comments.length !== nextProps.comments.length) {
      const isEmpty = currentProps.comments.length === 0;
      const newComments = isEmpty
        ? nextProps.comments
        : [nextProps.comments[nextProps.comments.length - 1]].concat(
            this.state.sortedComments
          );
      sortedComments = updateSortedComments(
        newComments,
        currentProps.commentsSortOption,
        nextProps.commentslikes,
        isEmpty
      );
    }

    /* Shallow comparison to verify if arrays are different.
    It means they are not pointing to the same object,
    not that their values are different */
    if (currentProps.comments !== nextProps.comments) {
      sortedComments = updateSortedComments(
        nextProps.comments,
        currentProps.commentsSortOption,
        nextProps.commentslikes
      );
    }

    // commentslikes changed
    if (
      nextProps.commentslikes &&
      !isEqual(currentProps.commentslikes, nextProps.commentslikes)
    ) {
      const updatedComments = getUpdatedComments(
        nextProps.commentslikes,
        nextProps.comments
      );
      const newComments = mergeNewComments(
        this.state.sortedComments,
        updatedComments
      );
      sortedComments = updateSortedComments(
        newComments,
        currentProps.commentsSortOption,
        nextProps.commentslikes,
        false
      );
    }

    // comment gets censored
    if (
      nextProps.censoredComment &&
      !isEqual(currentProps.censoredComment, nextProps.censoredComment)
    ) {
      sortedComments = updateSortedComments(
        nextProps.comments,
        currentProps.commentsSortOption,
        nextProps.commentslikes,
        true
      );
    }

    if (sortedComments) {
      this.setState({ sortedComments });
    }
  };

  render() {
    const {
      isLoading,
      proposal,
      token,
      error,
      markdownFile,
      otherFiles,
      onFetchData,
      commentid,
      tempThreadTree,
      isCMS,
      ...props
    } = this.props;
    const comments = this.state.sortedComments;
    const tempTree = tempThreadTree[commentid];
    let data, selftext;
    if (!isCMS) {
      data = proposalToT3(proposal, 0).data;
      selftext = markdownFile ? getTextFromIndexMd(markdownFile) : null;
    } else {
      data = invoiceToT3(proposal, 0).data;
      selftext = markdownFile ? getTextFromJsonToCsv(markdownFile) : null;
    }

    return (
      <div className="content" role="main">
        <div className="page proposal-page">
          {error ? (
            <Message type="error" header="Proposal not found" body={error} />
          ) : (
            <Content
              {...{
                isLoading,
                error,
                commentid,
                comments,
                bodyClassName: "single-page comments-page",
                onFetchData: () => onFetchData(token),
                listings: isLoading
                  ? []
                  : [
                      {
                        allChildren: [
                          {
                            kind: "t3",
                            data: {
                              ...data,
                              otherFiles,
                              selftext: selftext,
                              selftext_html: selftext
                            }
                          }
                        ]
                      },
                      {
                        allChildren: commentsToT1(comments, commentid, tempTree)
                      }
                    ],
                ...props
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(ProposalDetail);
