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
  isRfpProposal,
  showStatusChangeReason,
  showVoteStatusBar,
} from "../../pi/proposals/utils";
import {
  ProposalDownloads,
  ProposalMetadata,
  ProposalStatusBar,
  ProposalStatusLabel,
  ProposalStatusTag,
  ProposalSubtitle,
  ProposalTitle,
} from "./common";
import { Button, ButtonIcon, Icon, Message, classNames } from "pi-ui";
import { getShortToken } from "@politeiagui/core/records/utils";
import styles from "./styles.module.css";
import { ModalProposalDiff } from "./ModalProposalDiff";
import { ProposalsCompact } from "./ProposalsCompact";
import { PROPOSAL_STATUS_APPROVED } from "../../pi";
import { ModalTicketSearch } from "@politeiagui/ticketvote/ui";

const ExpandIcon = ({ link }) => (
  <a data-link href={link}>
    <Icon type="expand" viewBox="0 0 450 450" height={30} width={30} />
  </a>
);

const ProposalDetails = ({
  record,
  rfpRecord,
  voteSummary,
  proposalSummary,
  proposalStatusChanges,
  rfpSubmissionsRecords,
  rfpSubmissionsVoteSummaries,
  rfpSubmissionsProposalSummaries,
  rfpSubmissionsCommentsCounts,
  hideBody,
}) => {
  const [open] = useModal();

  const proposalDetails = decodeProposalRecord(record);
  const body = proposalDetails.body;
  const proposalLink = `/record/${getShortToken(proposalDetails.token)}`;

  // RFP Linked Proposal
  const rfpProposal = decodeProposalRecord(rfpRecord);
  const rfpProposalLink =
    rfpProposal && `/record/${getShortToken(rfpProposal.token)}`;

  const imagesByDigest = getImagesByDigest(body, proposalDetails.attachments);
  const imagesNotInText = proposalDetails.attachments.filter(
    (f) => !imagesByDigest[f.digest]
  );

  function handleShowRawMarkdown() {
    router.navigateTo(proposalLink);
  }
  function handleChangeVersion(version) {
    open(ModalProposalDiff, {
      oldVersion: version === proposalDetails.version ? version - 1 : version,
      currentProposal: proposalDetails,
      newVersion: proposalDetails.version,
      token: proposalDetails.token,
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

  function handleOpenSearchVotesModal() {
    open(ModalTicketSearch, {
      token: proposalDetails.token,
    });
  }

  const isAbandoned = proposalDetails.archived || proposalDetails.censored;

  const currentStatusChange =
    proposalSummary && proposalStatusChanges?.[proposalSummary.status];

  return (
    <div data-testid="proposal-details">
      {currentStatusChange?.reason &&
        showStatusChangeReason(proposalSummary?.status) && (
          <Message kind="warning" data-testid="status-change-reason">
            <div>Proposal is {currentStatusChange.status}.</div>
            <div>Reason: {currentStatusChange.reason}</div>
          </Message>
        )}
      <RecordCard
        token={proposalDetails.token}
        title={
          <ProposalTitle
            title={proposalDetails.name}
            isRfp={isRfpProposal(record)}
          />
        }
        titleLink={proposalLink}
        isDimmed={isAbandoned}
        subtitle={
          <ProposalSubtitle
            rfpLink={{ name: rfpProposal?.name, link: rfpProposalLink }}
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
            {showVoteStatusBar(voteSummary) && (
              <ProposalStatusBar voteSummary={voteSummary} />
            )}
            <ProposalMetadata metadata={proposalDetails.proposalMetadata} />
            {isRfpProposal(record) &&
              proposalSummary.status === PROPOSAL_STATUS_APPROVED && (
                <ProposalsCompact
                  title="Submitted Proposals"
                  records={rfpSubmissionsRecords}
                  voteSummaries={rfpSubmissionsVoteSummaries}
                  proposalSummaries={rfpSubmissionsProposalSummaries}
                  commentsCounts={rfpSubmissionsCommentsCounts}
                />
              )}
          </div>
        }
        thirdRow={
          <div className={classNames(hideBody && styles.collapse)}>
            <div className={styles.proposalBody} data-testid="proposal-body">
              <MarkdownRenderer body={body} filesBySrc={imagesByDigest} />
              <ThumbnailGrid
                files={imagesNotInText}
                readOnly
                onClick={handleOpenImageModal}
              />
            </div>
            {hideBody && <ExpandIcon link={proposalLink} />}
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
              token={proposalDetails.token}
              version={proposalDetails.version}
            />
            <div className={styles.footerButtons}>
              <a
                href={`/record/${getShortToken(proposalDetails.token)}/raw`}
                data-link
              >
                <ButtonIcon type="markdown" viewBox="0 0 208 128" />
              </a>
              <ButtonIcon type="link" onClick={handleShowRawMarkdown} />
              <ButtonIcon
                type="search"
                onClick={handleOpenSearchVotesModal}
                data-testid="proposal-search-votes-button"
              />
            </div>
          </>
        }
      />
    </div>
  );
};

export default ProposalDetails;
