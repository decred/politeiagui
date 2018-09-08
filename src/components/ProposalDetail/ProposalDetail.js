import React from "react";
import isEqual from "lodash/isEqual";
import { Content } from "../snew";
import { commentsToT1, proposalToT3 } from "../../lib/snew";
import { getTextFromIndexMd } from "../../helpers";
import Message from "../Message";
import { updateSortedComments, mergeNewComments, getUpdatedComments } from "./helpers";

class ProposalDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedComments: []
    };
  }
  componentDidUpdate(prevProps) {
    if((!prevProps.proposal || Object.keys(prevProps.proposal).length === 0 ) &&
      this.props.proposal && Object.keys(this.props.proposal).length > 0 &&
      this.props.proposal.status === 4 ){
      prevProps.onFetchProposalVoteStatus(prevProps.token);
    }
    this.handleUpdateOfComments(prevProps, this.props);
  }
  componentDidMount() {
    this.props.onFetchLikedComments(this.props.token);
  }
  componentWillUnmount() {
    this.props.resetLastSubmittedProposal();
  }
  handleUpdateOfComments = (currentProps, nextProps) => {
    let sortedComments;

    if(!nextProps.comments || nextProps.comments.length === 0) {
      return;
    }
    // sort option changed
    if(currentProps.commentsSortOption !== nextProps.commentsSortOption) {
      sortedComments = updateSortedComments(
        this.state.sortedComments,
        nextProps.commentsSortOption
      );
    }

    // new comment added
    if(currentProps.comments.length !== nextProps.comments.length) {
      const isEmpty = currentProps.comments.length === 0;
      const newComments = isEmpty ?
        nextProps.comments :
        [nextProps.comments[nextProps.comments.length - 1]]
          .concat(this.state.sortedComments);
      sortedComments = updateSortedComments(
        newComments,
        currentProps.commentsSortOption,
        nextProps.commentsvotes,
        isEmpty
      );
    }

    // usernames aren't fully merged into comments
    const commentWithoutAnUsername = comments => comments.filter(c => !c.username)[0];
    if (commentWithoutAnUsername(this.state.sortedComments) && !commentWithoutAnUsername(nextProps.comments)) {
      sortedComments = updateSortedComments(
        nextProps.comments,
        currentProps.commentsSortOption,
        nextProps.commentsvotes,
        false
      );
    }

    // commentsvotes changed
    if(nextProps.commentsvotes && !isEqual(currentProps.commentsvotes, nextProps.commentsvotes)) {
      const updatedComments = getUpdatedComments(nextProps.commentsvotes, nextProps.comments);
      const newComments = mergeNewComments(this.state.sortedComments, updatedComments);
      sortedComments = updateSortedComments(
        newComments,
        currentProps.commentsSortOption,
        nextProps.commentsvotes,
        false
      );
    }

    if(sortedComments) {
      this.setState({ sortedComments });
    }
  }
  render() {
    const {
      isLoading,
      proposal,
      token,
      error,
      markdownFile,
      otherFiles,
      onFetchData,
      ...props
    } = this.props;
    const comments = this.state.sortedComments;

    return (
      <div className="content" role="main">
        <div className="page proposal-page">
          {error ? (
            <Message
              type="error"
              header="Proposal not found"
              body={error} />
          ) : (
            <Content  {...{
              isLoading,
              error,
              bodyClassName: "single-page comments-page",
              onFetchData: () => onFetchData(token),
              listings: isLoading ? [] : [
                {
                  allChildren: [{
                    kind: "t3",
                    data: {
                      ...proposalToT3(proposal, 0).data,
                      otherFiles,
                      selftext: markdownFile ? getTextFromIndexMd(markdownFile) : null,
                      selftext_html: markdownFile ? getTextFromIndexMd(markdownFile) : null
                    }
                  }]
                },
                { allChildren: commentsToT1(comments) }
              ],
              ...props
            }} />
          )}
        </div>
      </div>
    );
  }
}

export default ProposalDetail;
