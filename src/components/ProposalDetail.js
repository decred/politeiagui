import React from "react";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";
import { Content } from "./snew";
import { formatProposalData, commentsToT1 } from "../lib/snew";
import { getTextFromIndexMd } from "../helpers";
import Message from "./Message";

const newSort = orderBy([get("timestamp")], ["desc"]);

const ProposalDetail = ({
  isLoading, proposal, comments, token, error, markdownFile, otherFiles, onFetchData, activeVotes, ...props
}) => (
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
                  otherFiles,
                  selftext: markdownFile ? getTextFromIndexMd(markdownFile) : null,
                  selftext_html: markdownFile ? getTextFromIndexMd(markdownFile) : null
                }
              }]
            },
            { allChildren: commentsToT1(newSort(comments)) }
          ],
          ...props}} />
      )}
    </div>
  </div>
);

export default ProposalDetail;
