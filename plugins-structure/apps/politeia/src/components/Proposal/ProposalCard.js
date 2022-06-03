import React from "react";
import { Button, StatusTag } from "pi-ui";
import { RecordCard } from "@politeiagui/common-ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import { decodeProposalRecord, getLegacyProposalStatusTagProps } from "./utils";
import { ProposalStatusBar, ProposalSubtitle } from "./common";

const ProposalCard = ({ record, voteSummary, commentsCount = 0 }) => {
  const proposal = decodeProposalRecord(record);
  const statusTagProps = getLegacyProposalStatusTagProps(record, voteSummary);
  return (
    <div>
      <RecordCard
        isDimmed={proposal.archived || proposal.censored}
        titleLink={`/record/${getShortToken(proposal.token)}`}
        title={proposal.name}
        subtitle={
          <ProposalSubtitle
            userid={proposal.author.userid}
            username={proposal.author.username}
            publishedat={proposal.timestamps.publishedat}
            editedat={proposal.timestamps.editedat}
            token={proposal.token}
            version={proposal.version}
          />
        }
        rightHeader={<StatusTag {...statusTagProps} />}
        secondRow={<ProposalStatusBar voteSummary={voteSummary} />}
        footer={
          <>
            <span>{commentsCount} Comments</span>
            <Button>Click Me</Button>
          </>
        }
      />
    </div>
  );
};

export default ProposalCard;
