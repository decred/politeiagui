import React from "react";
import { router } from "@politeiagui/core/router";
import {
  MarkdownRenderer,
  ModalImages,
  RecordCard,
  RecordToken,
  ThumbnailGrid,
  useModal,
} from "@politeiagui/common-ui";
import { decodeProposalRecord, getImagesByDigest } from "./utils";
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
  const body = proposalDetails.body;

  const imagesByDigest = getImagesByDigest(body, proposalDetails.attachments);

  function handleShowRawMarkdown() {
    router.navigateTo(`/record/${getShortToken(proposalDetails.token)}/raw`);
  }
  async function handleFetchVersion(version) {
    const proposalVersion = await onFetchVersion(version);
    const { body: oldBody } = decodeProposalRecord(proposalVersion);
    open(ModalProposalDiff, { oldBody, newBody: body });
  }
  function handleOpenImageModal(index) {
    const images = proposalDetails.attachments
      .filter((f) => f.mime === "image/png")
      .map((file) => ({
        src: `data:${file.mime};base64,${file.payload}`,
        alt: file.name,
      }));
    open(ModalImages, { images, activeIndex: index });
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
        thirdRow={
          <div className={styles.proposalBody}>
            <MarkdownRenderer body={body} filesBySrc={imagesByDigest} />
            <ThumbnailGrid
              files={proposalDetails.attachments}
              readOnly
              onClick={handleOpenImageModal}
            />
          </div>
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
