import React from "react";
import { RecordItem } from "@politeiagui/common-ui";
import { decodeProposalRecord } from "../../pi/proposals/utils";
import { CommentsCount } from "@politeiagui/comments/ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import { ProposalStatusBar, ProposalStatusTag } from "./common";
import { H4 } from "pi-ui";

export function ProposalsCompact({
  title,
  records,
  voteSummaries,
  proposalSummaries,
  commentsCounts,
}) {
  return (
    <div>
      <H4>{title}</H4>
      {records.map((record, i) => {
        const { name, token } = decodeProposalRecord(record);
        const proposalLink = `/record/${getShortToken(token)}`;
        return (
          <RecordItem
            title={name}
            titleLink={proposalLink}
            key={i}
            subtitle={
              <CommentsCount
                link={`${proposalLink}?scrollToComments=true`}
                count={commentsCounts[token]}
              />
            }
            info={<ProposalStatusBar voteSummary={voteSummaries[token]} />}
            tag={
              <ProposalStatusTag proposalSummary={proposalSummaries[token]} />
            }
          />
        );
      })}
    </div>
  );
}
