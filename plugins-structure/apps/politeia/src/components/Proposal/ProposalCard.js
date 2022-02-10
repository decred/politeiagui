import React from "react";
import { Button, Link, StatusTag, Text } from "pi-ui";
import { Event, Join, RecordCard } from "@politeiagui/common-ui";
import { TicketvoteRecordVoteStatusBar } from "@politeiagui/ticketvote/ui";
import {
  decodeProposalRecord,
  getProposalStatusTagProps,
  showVoteStatusBar,
} from "./utils";

const ProposalCard = ({ record, voteSummary, commentsCount = 0 }) => {
  const proposal = decodeProposalRecord(record);
  const statusTagProps = getProposalStatusTagProps(record, voteSummary);
  return (
    <div>
      <RecordCard
        token={proposal.token}
        title={proposal.name}
        subtitle={
          <Join>
            <Link href={`user/${proposal.author.userid}`}>
              {proposal.author.username}
            </Link>
            {proposal.timestamps.publishedat && (
              <Event
                event="published"
                timestamp={proposal.timestamps.publishedat}
              />
            )}
            {proposal.timestamps.editedat && (
              <Event event="edited" timestamp={proposal.timestamps.editedat} />
            )}
            <Text
              id={`proposal-${proposal.token}-version`}
              truncate
            >{`version ${proposal.version}`}</Text>
          </Join>
        }
        rightHeader={<StatusTag {...statusTagProps} />}
        secondRow={
          showVoteStatusBar(voteSummary) && (
            <TicketvoteRecordVoteStatusBar ticketvoteSummary={voteSummary} />
          )
        }
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
