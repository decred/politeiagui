import React from "react";
import { Button, StatusTag } from "pi-ui";
import { RecordCard } from "@politeiagui/common-ui";
import { CommentsCount } from "@politeiagui/comments/ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import { decodeProposalRecord, getLegacyProposalStatusTagProps } from "./utils";
import { ProposalStatusBar, ProposalSubtitle } from "./common";

const ProposalCard = ({ record, voteSummary, commentsCount = 0 }) => {
  const proposal = decodeProposalRecord(record);
  const statusTagProps = getLegacyProposalStatusTagProps(record, voteSummary);
  const proposalLink = `/record/${getShortToken(proposal.token)}`;
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
        rightHeader={<StatusTag {...statusTagProps} />}
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
