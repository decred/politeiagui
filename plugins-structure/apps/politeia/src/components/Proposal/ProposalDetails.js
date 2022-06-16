import React from "react";
import {
  MarkdownRenderer,
  RecordCard,
  RecordToken,
  useModal,
} from "@politeiagui/common-ui";
import { decodeProposalRecord, replaceImgDigestWithPayload } from "./utils";
import {
  ProposalDownloads,
  ProposalMetadata,
  ProposalStatusBar,
  ProposalStatusTag,
  ProposalSubtitle,
} from "./common";
import { Button, ButtonIcon, Message } from "pi-ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import styles from "./styles.module.css";
import ModalProposalDiff from "./ModalProposalDiff";

const ProposalDetails = ({
  record,
  voteSummary,
  piSummary,
  onFetchRecordTimestamps,
  onFetchVersion,
}) => {
  const [open] = useModal();

  const proposalDetails = decodeProposalRecord(record);
  const { text: body } = replaceImgDigestWithPayload(
    proposalDetails.body,
    proposalDetails.attachments
  );
  function handleShowRawMarkdown() {
    window.location.pathname = `/record/${getShortToken(
      proposalDetails.token
    )}/raw`;
  }
  async function handleFetchVersion(version) {
    const proposalVersion = await onFetchVersion(version);
    const { body: oldBody } = decodeProposalRecord(proposalVersion);
    open(ModalProposalDiff, { oldBody, newBody: body });
  }

  const isAbandoned = proposalDetails.archived || proposalDetails.censored;

  return (
    <div>
      {isAbandoned && (
        <Message kind="warning">
          Reason: {proposalDetails.abandonmentReason}
        </Message>
      )}
      <RecordCard
        token={proposalDetails.token}
        title={proposalDetails.name}
        isDimmed={isAbandoned}
        subtitle={
          <ProposalSubtitle
            userid={proposalDetails.author.userid}
            username={proposalDetails.author.username}
            timestamps={proposalDetails.timestamps}
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
        thirdRow={<MarkdownRenderer body={body} />}
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
