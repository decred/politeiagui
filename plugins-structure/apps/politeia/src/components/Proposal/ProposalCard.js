import React from "react";
import { Button } from "pi-ui";
import { RecordCard } from "@politeiagui/common-ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import { decodeProposalRecord } from "./utils";
import {
  ProposalStatusBar,
  ProposalStatusTag,
  ProposalSubtitle,
} from "./common";

const ProposalCard = ({
  record,
  voteSummary,
  piSummary,
  commentsCount = 0,
}) => {
  const proposal = decodeProposalRecord(record);
  return (
    <div>
      <RecordCard
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
        rightHeader={<ProposalStatusTag piSummary={piSummary} />}
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
