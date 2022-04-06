import React, { useState } from "react";
import {
  MarkdownDiffHTML,
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
import { Button, ButtonIcon, Text } from "pi-ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import styles from "./styles.module.css";

const ProposalDetails = ({
  record,
  voteSummary,
  piSummary,
  onFetchRecordTimestamps,
  onFetchVersion,
}) => {
  // TEMPORARY: this is temporary and should be removed when modal gets
  // implemented.
  const [diff, setDiff] = useState();

  const proposalDetails = decodeProposalRecord(record);
  function handleShowRawMarkdown() {
    window.location.pathname = `/record/${getShortToken(
      proposalDetails.token
    )}/raw`;
  }
  async function handleFetchVersion(version) {
    const proposalVersion = await onFetchVersion(version);
    // TODO: display diff on modal
    const { body } = decodeProposalRecord(proposalVersion);
    setDiff(body);
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
            onChangeVersion={handleFetchVersion}
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
        thirdRow={
          diff ? (
            <div>
              <Text color="yellow">TEMPORARY</Text>
              <button onClick={() => setDiff(null)}>Clear Diff</button>
              <MarkdownDiffHTML oldText={diff} newText={proposalDetails.body} />
            </div>
          ) : (
            <MarkdownRenderer body={proposalDetails.body} />
          )
        }
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
