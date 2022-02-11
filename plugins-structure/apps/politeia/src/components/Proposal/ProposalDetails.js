import React from "react";
import { RecordCard } from "@politeiagui/common-ui";
import { decodeProposalRecord } from "./utils";
import {
  ProposalMetadata,
  ProposalStatusBar,
  ProposalStatusTag,
  ProposalSubtitle,
} from "./common";

const ProposalDetails = ({ record, voteSummary }) => {
  const proposalDetails = decodeProposalRecord(record);
  console.log(proposalDetails);
  return (
    <div>
      <RecordCard
        token={proposalDetails.token}
        title={proposalDetails.name}
        subtitle={
          <ProposalSubtitle
            userid={proposalDetails.author.userid}
            username={proposalDetails.author.username}
            publishedat={proposalDetails.timestamps.publishedat}
            editedat={proposalDetails.timestamps.editedat}
            token={proposalDetails.token}
            version={proposalDetails.version}
          />
        }
        rightHeader={
          <ProposalStatusTag record={record} voteSummary={voteSummary} />
        }
        secondRow={
          <>
            <ProposalStatusBar voteSummary={voteSummary} />
            <ProposalMetadata metadata={proposalDetails.proposalMetadata} />
          </>
        }
        thirdRow={<div>{proposalDetails.body}</div>}
        footer={
          <>
            <span>Downloads</span>
          </>
        }
      />
    </div>
  );
};

export default ProposalDetails;
