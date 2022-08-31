import React from "react";
import { Button } from "pi-ui";
import { RecordCard } from "@politeiagui/common-ui";
import { CommentsCount } from "@politeiagui/comments/ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import { decodeProposalRecord, isRfpProposal } from "../../pi/proposals/utils";
import {
  ProposalStatusBar,
  ProposalStatusLabel,
  ProposalStatusTag,
  ProposalSubtitle,
  ProposalTitle,
} from "./common";

const ProposalCard = ({
  record,
  rfpRecord,
  voteSummary,
  commentsCount,
  proposalSummary,
  proposalStatusChanges,
}) => {
  const proposal = decodeProposalRecord(record);
  const proposalLink = `/record/${getShortToken(proposal.token)}`;

  // Only RFP Submissions have a corresponding RFP Proposal
  const rfpProposal = decodeProposalRecord(rfpRecord);
  const rfpProposalLink =
    rfpProposal && `/record/${getShortToken(rfpProposal.token)}`;

  const currentStatusChange =
    proposalSummary && proposalStatusChanges?.[proposalSummary.status];
  return (
    <div data-testid="proposal-card">
      <RecordCard
        isDimmed={proposal.archived || proposal.censored}
        titleLink={proposalLink}
        title={
          <ProposalTitle title={proposal.name} isRfp={isRfpProposal(record)} />
        }
        subtitle={
          <ProposalSubtitle
            rfpLink={{ name: rfpProposal?.name, link: rfpProposalLink }}
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
