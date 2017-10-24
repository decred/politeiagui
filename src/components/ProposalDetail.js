import React from "react";
import { Content } from "./snew";
import { proposalToT3 } from "../lib/snew";

const ProposalDetail = ({
  isLoading, proposal, token, error, markdownFile, otherFiles, onFetchData, ...props
}) => console.log("markdownFile", markdownFile) || (
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
      { allChildren: [] }
    ],
    ...props
  }} />
);

export default ProposalDetail;
