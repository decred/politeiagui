import { classNames, StatusBar, StatusTag, Text, useMediaQuery } from "pi-ui";
import React, { useState } from "react";
import Markdown from "../Markdown";
import ModalSearchVotes from "../ModalSearchVotes";
import RecordWrapper from "../RecordWrapper";
import {
  getMarkdownContent,
  getProposalStatusTagProps,
  getQuorumInVotes,
  getStatusBarData,
  getVotesReceived,
  isAbandonedProposal,
  isPublicProposal,
  isEditableProposal
} from "./helpers";
import { useProposalVoteInfo } from "./hooks";
import { useLoaderContext } from "src/Appv2/Loader";
import styles from "./Proposal.module.css";
import LoggedInContent from "src/componentsv2/LoggedInContent";
import VotesCount from "./VotesCount";
import DownloadComments from "src/containers/Comments/Download";
import ProposalActions from "./ProposalActions";
import { useFullImageModal } from "../ProposalForm/hooks";
import ThumbnailGrid from "../Files/Thumbnail";
import ModalFullImage from "../ModalFullImage";
import VersionPicker from "src/componentsv2/VersionPicker";

const Proposal = ({ proposal, extended, children }) => {
  const {
    censorshiprecord,
    files,
    name,
    numcomments,
    publishedat,
    abandonedat,
    timestamp,
    userid,
    username,
    version,
    voteStatus
  } = proposal;
  const { currentUser } = useLoaderContext();
  const {
    showFullImageModal,
    openFullImageModal,
    closeFullImageModal
  } = useFullImageModal();
  const hasVoteStatus = !!voteStatus && !!voteStatus.endheight;
  const proposalToken = censorshiprecord && censorshiprecord.token;
  const proposalURL = `/proposal/${proposalToken}`;
  const isPublic = isPublicProposal(proposal);
  const isAbandoned = isAbandonedProposal(proposal);
  const isPublicAccessible = isPublic || isAbandoned;
  const isAuthor = currentUser && currentUser.userid === userid;
  const isEditable = isAuthor && isEditableProposal(proposal);
  const {
    voteActive: isVoteActive,
    voteTimeLeft,
    voteBlocksLeft
  } = useProposalVoteInfo(proposal);
  const mobile = useMediaQuery("(max-width: 560px)");
  const [showSearchVotesModal, setShowSearchVotesModal] = useState(false);
  function handleCloseSearchVotesModal() {
    setShowSearchVotesModal(false);
  }
  function handleOpenSearchVotesModal() {
    setShowSearchVotesModal(true);
  }
  const onClickFile = f => () => {
    openFullImageModal(f);
  };
  return (
    <>
      <RecordWrapper>
        {({
          Author,
          Event,
          Row,
          Title,
          CommentsLink,
          GithubLink,
          CopyLink,
          DownloadRecord,
          Header,
          Subtitle,
          Edit,
          Status,
          RecordToken
        }) => (
          <>
            <Header
              title={
                <Title
                  id={`proposal-title-${proposalToken}`}
                  truncate
                  linesBeforeTruncate={2}
                  url={extended ? "" : proposalURL}
                >
                  {name}
                </Title>
              }
              edit={
                isEditable && <Edit url={`/proposal/${proposalToken}/edit`} />
              }
              subtitle={
                <Subtitle>
                  <Author username={username} id={userid} />
                  {publishedat && !mobile && (
                    <Event event="published" timestamp={publishedat} />
                  )}
                  {timestamp !== publishedat && !abandonedat && !mobile && (
                    <Event event="edited" timestamp={timestamp} />
                  )}
                  {abandonedat && !mobile && (
                    <Event event={"abandoned"} timestamp={abandonedat} />
                  )}
                  {version > 1 && !extended && !mobile && (
                    <Text
                      id={`proposal-${proposalToken}-version`}
                      className={classNames(styles.version)}
                      color="gray"
                      truncate
                    >{`version ${version}`}</Text>
                  )}
                  {extended && (
                    <VersionPicker
                      className={classNames(styles.versionPicker)}
                      version={version}
                      token={proposalToken}
                    />
                  )}
                </Subtitle>
              }
              status={
                (isPublic || isAbandoned) && (
                  <Status>
                    <StatusTag
                      className={styles.statusTag}
                      {...getProposalStatusTagProps(proposal)}
                    />
                    {isVoteActive && (
                      <>
                        <Text
                          className={styles.timeLeft}
                          size="small"
                          color="gray"
                        >
                          {`vote ends ${voteTimeLeft}`}
                        </Text>
                        <Text
                          className="hide-on-mobile"
                          size="small"
                          color="gray"
                        >
                          {`${voteBlocksLeft} blocks left`}
                        </Text>
                      </>
                    )}
                  </Status>
                )
              }
              mobile={mobile}
            />
            {extended && (
              <Row topMarginSize="s">
                <RecordToken token={proposalToken} />
              </Row>
            )}
            {hasVoteStatus && (
              <Row>
                <StatusBar
                  max={getQuorumInVotes(voteStatus)}
                  status={getStatusBarData(voteStatus)}
                  markerPosition={`${voteStatus.passpercentage}%`}
                  renderStatusInfoComponent={
                    <VotesCount
                      isVoteActive={isVoteActive}
                      quorumVotes={getQuorumInVotes(voteStatus)}
                      votesReceived={getVotesReceived(proposal)}
                      onSearchVotes={handleOpenSearchVotesModal}
                    />
                  }
                />
              </Row>
            )}
            {extended && !!files.length && (
              <Markdown
                className={styles.markdownContainer}
                body={getMarkdownContent(files)}
              />
            )}
            {isPublicAccessible && !extended && (
              <Row justify="space-between">
                <CommentsLink
                  numOfComments={numcomments}
                  url={`/proposal/${proposalToken}?scrollToComments=true`}
                />
                <GithubLink token={proposalToken} />
              </Row>
            )}
            {extended && files.length > 1 && (
              <Row className={styles.filesRow} justify="left" topMarginSize="s">
                <ThumbnailGrid
                  value={files}
                  onClick={onClickFile}
                  viewOnly={true}
                />
              </Row>
            )}
            {extended && (
              <Row className={styles.lastRow}>
                <Row className={styles.downloadLinksWrapper} noMargin>
                  <DownloadRecord
                    fileName={proposalToken}
                    content={proposal}
                    className="margin-right-s"
                    label="Download Proposal Bundle"
                  />
                  {isPublic && !!numcomments && (
                    <DownloadComments
                      recordToken={proposalToken}
                      className={styles.downloadCommentsLink}
                    />
                  )}
                </Row>
                <Row className={styles.proposalActions}>
                  <CopyLink
                    className={isPublicAccessible ? styles.copyLink : ""}
                    url={window.location.origin + proposalURL}
                  />
                  {isPublicAccessible && <GithubLink token={proposalToken} />}
                </Row>
              </Row>
            )}
            <LoggedInContent>
              <ProposalActions proposal={proposal} />
            </LoggedInContent>
          </>
        )}
      </RecordWrapper>
      <ModalSearchVotes
        show={showSearchVotesModal}
        onClose={handleCloseSearchVotesModal}
        proposal={proposal}
      />
      {extended && (
        <ModalFullImage
          image={showFullImageModal}
          show={!!showFullImageModal}
          onClose={closeFullImageModal}
        />
      )}
    </>
  );
};

export default Proposal;
