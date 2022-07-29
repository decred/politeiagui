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
import {
  decodeProposalRecord,
  getImagesByDigest,
} from "../../pi/proposals/utils";
import {
  ProposalDownloads,
  ProposalMetadata,
  ProposalStatusBar,
  ProposalStatusLabel,
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
  proposalSummary,
  onFetchRecordTimestamps,
  proposalStatusChanges,
}) => {
  const [open] = useModal();

  const proposalDetails = decodeProposalRecord(record);
  const body = proposalDetails.body;

  const imagesByDigest = getImagesByDigest(body, proposalDetails.attachments);
  const imagesNotInText = proposalDetails.attachments.filter(
    (f) => !imagesByDigest[f.digest]
  );

  function handleShowRawMarkdown() {
    router.navigateTo(`/record/${getShortToken(proposalDetails.token)}/raw`);
  }
  async function handleChangeVersion(version) {
    open(ModalProposalDiff, {
      oldVersion: version === proposalDetails.version ? version - 1 : version,
      currentProposal: proposalDetails,
      newVersion: proposalDetails.version,
      token: proposalDetails.token,
      onFetchTimestamps: onFetchRecordTimestamps,
    });
  }
  function handleOpenImageModal(index) {
    const images = imagesNotInText
      .filter((f) => f.mime === "image/png")
      .map((file) => ({
        src: `data:${file.mime};base64,${file.payload}`,
        alt: file.name,
      }));
    open(ModalImages, { images, activeIndex: index });
  }

  const isAbandoned = proposalDetails.archived || proposalDetails.censored;

  const currentStatusChange =
    proposalSummary && proposalStatusChanges?.[proposalSummary.status];

  return (
    <div>
      {currentStatusChange?.reason && (
        <Message kind="warning">
          <div>Proposal is {currentStatusChange.status}.</div>
          <div>Reason: {currentStatusChange.reason}</div>
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
            onChangeVersion={handleChangeVersion}
          />
        }
        rightHeader={<ProposalStatusTag proposalSummary={proposalSummary} />}
        rightHeaderSubtitle={
          <ProposalStatusLabel statusChange={currentStatusChange} />
        }
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
              files={imagesNotInText}
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
