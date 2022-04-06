import React from "react";
import {
  MarkdownRenderer,
  RecordCard,
  RecordToken,
} from "@politeiagui/common-ui";
import { decodeProposalRecord } from "./utils";
import {
  ProposalDownloads,
  ProposalMetadata,
  ProposalStatusBar,
  ProposalStatusTag,
  ProposalSubtitle,
} from "./common";
import { Button, ButtonIcon } from "pi-ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import styles from "./styles.module.css";

const ProposalDetails = ({
  record,
  voteSummary,
  piSummary,
  onFetchRecordTimestamps,
  onFetchCommentsTimestamps,
}) => {
  const proposalDetails = decodeProposalRecord(record);
  function handleShowRawMarkdown() {
    window.location.pathname = `/record/${getShortToken(
      proposalDetails.token
    )}/raw`;
  }
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
        rightHeader={<ProposalStatusTag piSummary={piSummary} />}
        secondRow={
          <div className={styles.secondRow}>
            <RecordToken token={proposalDetails.token} isCopyable={true} />
            <ProposalStatusBar voteSummary={voteSummary} />
            <ProposalMetadata metadata={proposalDetails.proposalMetadata} />
          </div>
        }
        thirdRow={<MarkdownRenderer body={proposalDetails.body} />}
        fourthRow={
          <>
            <Button>Click Me</Button>
            <Button kind="secondary"> Click Again</Button>
          </>
        }
        footer={
          <>
            <ProposalDownloads
              record={record}
              onFetchRecordTimestamps={onFetchRecordTimestamps}
              onFetchCommentsTimestamps={onFetchCommentsTimestamps}
            />
            <div className={styles.footerButtons}>
              <ButtonIcon
                type="markdown"
                onClick={handleShowRawMarkdown}
                viewBox="0 0 208 128"
              />
              <ButtonIcon type="link" onClick={handleShowRawMarkdown} />
            </div>
          </>
        }
      />
    </div>
  );
};

export default ProposalDetails;
