import React from "react";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";
import { Content } from "./snew";
import { commentsToT1, proposalToT3 } from "../lib/snew";
import { getTextFromIndexMd } from "../helpers";
import Message from "./Message";

const newSort = orderBy([get("timestamp")], ["desc"]);
class ProposalDetail extends React.Component {
  componentWillReceiveProps(nextProps) {
    if((!this.props.proposal || Object.keys(this.props.proposal).length === 0 ) &&
      nextProps.proposal && Object.keys(nextProps.proposal).length > 0 &&
      nextProps.proposal.status === 4 ){
      this.props.onFetchProposalVoteStatus(this.props.token);
    }
    if (this.props.comments !== nextProps.comments) {
      this.props.onFetchLikedComments(this.props.token);
    }
  }
  mergeCommentsAndVotes() {
    const votes = this.props.commentsvotes;
    const comments = this.props.comments;
    return votes ? comments.map(c => {
      const found = votes.find((element) => element.commentid === c.commentid);
      return found ? {...c, vote: found.action} : {...c, vote: 0};
    }) : comments;
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
    const votesandcomments = this.mergeCommentsAndVotes();
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
                { allChildren: commentsToT1(newSort(votesandcomments)) }
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
