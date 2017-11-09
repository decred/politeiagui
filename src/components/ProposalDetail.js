import React from "react";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";
import { Content } from "./snew";
import { proposalToT3, commentsToT1 } from "../lib/snew";

const newSort = orderBy([get("timestamp")], ["desc"]);

const ProposalDetail = ({
  isLoading, proposal, comments, token, error, markdownFile, otherFiles, onFetchData, ...props
}) => (
  <Content  {...{
    isLoading,
    error,
    onFetchData: () => onFetchData(token),
    listings: isLoading || !proposal.name ? [] : [
      {
        allChildren: [{
          kind: "t3",
          data: {
            ...proposalToT3(proposal).data,
            otherFiles,
            selftext: markdownFile ? atob(markdownFile.payload) : null,
            selftext_html: markdownFile ? atob(markdownFile.payload) : null
          }
        }]
      },
      { allChildren: commentsToT1(newSort(comments)) }
    ],
    ...props
  }} />
);

export default ProposalDetail;
