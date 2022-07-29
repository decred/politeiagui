import React from "react";
import { Button } from "pi-ui";
import { RecordCard } from "@politeiagui/common-ui";
import { CommentsCount } from "@politeiagui/comments/ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import { decodeProposalRecord } from "../../pi/proposals/utils";
import {
  ProposalStatusBar,
  ProposalStatusLabel,
  ProposalStatusTag,
  ProposalSubtitle,
} from "./common";

const ProposalCard = ({
  record,
  voteSummary,
  commentsCount,
  proposalSummary,
  proposalStatusChanges,
}) => {
  const proposal = decodeProposalRecord(record);
  const proposalLink = `/record/${getShortToken(proposal.token)}`;
  const currentStatusChange =
    proposalSummary && proposalStatusChanges?.[proposalSummary.status];
  return (
    <div>
      <RecordCard
        isDimmed={proposal.archived || proposal.censored}
        titleLink={proposalLink}
        title={proposal.name}
        subtitle={
          <ProposalSubtitle
            userid={proposal.author.userid}
            username={proposal.author.username}
            timestamps={proposal.timestamps}
            token={proposal.token}
            version={proposal.version}
          />
        }
        rightHeader={<ProposalStatusTag proposalSummary={proposalSummary} />}
        rightHeaderSubtitle={
          <ProposalStatusLabel statusChange={currentStatusChange} />
        }
        secondRow={<ProposalStatusBar voteSummary={voteSummary} />}
        footer={
          <>
            <CommentsCount
              link={`${proposalLink}?scrollToComments=true`}
              count={commentsCount}
            />
            <Button>Click Me</Button>
          </>
        }
      />
    </div>
  );
};

export default ProposalCard;
