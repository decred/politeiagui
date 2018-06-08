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
      this.props.onFetchVoteResults(this.props.token);
    }
  }
  render() {
    const {
      isLoading,
      proposal,
      comments,
      token,
      error,
      markdownFile,
      otherFiles,
      onFetchData,
      voteDetails,
      castedVotes,
      ...props
    } = this.props;

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
                      startvotereply: voteDetails,
                      castedVotes,
                      otherFiles,
                      selftext: markdownFile ? getTextFromIndexMd(markdownFile) : null,
                      selftext_html: markdownFile ? getTextFromIndexMd(markdownFile) : null
                    }
                  }]
                },
                { allChildren: commentsToT1(newSort(comments)) }
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
