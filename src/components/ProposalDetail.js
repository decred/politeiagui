import React from "react";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";
import { Content } from "./snew";
import { formatProposalData, commentsToT1 } from "../lib/snew";
import { getTextFromIndexMd } from "../helpers";
import Message from "./Message";

const newSort = orderBy([get("timestamp")], ["desc"]);
class ProposalDetail extends React.Component {
  componentWillReceiveProps(nextProps) {
    if((!this.props.proposal || Object.keys(this.props.proposal).length === 0 ) &&
      nextProps.proposal && Object.keys(nextProps.proposal).length > 0 ){
      this.props.onFetchVoteResults({ token: this.props.token });
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
      activeVotes,
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
                      ...formatProposalData(proposal, 0, activeVotes).data,
                      voteDetails,
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
