import React from "react";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";
import { Content } from "./snew";
import { proposalToT3, commentsToT1 } from "../lib/snew";
import { getTextFromIndexMd } from "../helpers";
import Message from "./Message";
import Loading from "./snew/Loading";

const newSort = orderBy([get("timestamp")], ["desc"]);

const ProposalDetail = ({
  isLoading, proposal, comments, token, error, markdownFile, otherFiles, onFetchData, ...props
}) => (
  <div className="content" role="main">
    <div className="page proposal-page">
      {error ? (
        <Message
          type="error"
          header="Proposal not found"
          body={error} />
      ) : [
        <Loading style={{minHeight: "500px"}} hidden={!isLoading} />,
        <Content  {...{
          isLoading: false,
          error,
          bodyClassName: "single-page comments-page",
          onFetchData: () => onFetchData(token),
          listings: isLoading ? [] : [
            {
              allChildren: [{
                kind: "t3",
                data: {
                  ...proposalToT3(proposal).data,
                  otherFiles,
                  selftext: markdownFile ? getTextFromIndexMd(markdownFile) : null,
                  selftext_html: markdownFile ? getTextFromIndexMd(markdownFile) : null
                }
              }]
            },
            { allChildren: commentsToT1(newSort(comments)) }
          ],
          ...props}} />
      ]}
    </div>
  </div>
);

export default ProposalDetail;
