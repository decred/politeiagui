import React from "react";
import {
  MarkdownRenderer,
  RecordCard,
  RecordToken,
} from "@politeiagui/common-ui";
import { decodeProposalRecord } from "./utils";
import {
  ProposalMetadata,
  ProposalStatusBar,
  ProposalStatusTag,
  ProposalSubtitle,
} from "./common";
import styles from "./styles.module.css";

const ProposalDetails = ({ record, voteSummary }) => {
  const proposalDetails = decodeProposalRecord(record);
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
          <div className={styles.secondRow}>
            <RecordToken token={proposalDetails.token} isCopyable={true} />
            <ProposalStatusBar voteSummary={voteSummary} />
            <ProposalMetadata metadata={proposalDetails.proposalMetadata} />
          </div>
        }
        thirdRow={<MarkdownRenderer body={proposalDetails.body} />}
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
