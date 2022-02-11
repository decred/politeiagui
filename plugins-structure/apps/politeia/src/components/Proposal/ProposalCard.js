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

const ProposalCard = ({ record, voteSummary, commentsCount = 0 }) => {
  const proposal = decodeProposalRecord(record);
  return (
    <div>
      <RecordCard
        token={getShortToken(proposal.token)}
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
        rightHeader={
          <ProposalStatusTag record={record} voteSummary={voteSummary} />
        }
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
