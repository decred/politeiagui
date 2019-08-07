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
import VotesCount from "./VotesCount";
import DownloadComments from "src/containers/Comments/Download";
import FilesThumbnail from "../Files/Thumbnail";

const Proposal = ({ proposal, extended }) => {
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
  const hasVoteStatus = !!voteStatus && !!voteStatus.endheight;
  const proposalToken = censorshiprecord && censorshiprecord.token;
  const proposalURL = `/proposal/${proposalToken}`;
  const isPublic = isPublicProposal(proposal);
  const isAbandoned = isAbandonedProposal(proposal);
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
                  {publishedat && (
                    <Event event="published" timestamp={publishedat} />
                  )}
                  {timestamp !== publishedat && timestamp !== abandonedat && (
                    <Event event="edited" timestamp={timestamp} />
                  )}
                  {abandonedat && (
                    <Event event={"abandoned"} timestamp={abandonedat} />
                  )}
                  {version > 1 && (
                    <Text
                      id={`proposal-${proposalToken}-version`}
                      className={classNames(styles.version, "hide-on-mobile")}
                      color="gray"
                      truncate
                    >{`version ${version}`}</Text>
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
            {extended && (
              <Markdown
                className={styles.markdownContainer}
                body={getMarkdownContent(files)}
              />
            )}
            {(isPublic || isAbandoned) && !extended && (
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
                <FilesThumbnail 
                  value={files}
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
                    className={styles.copyLink}
                    url={window.location.origin + proposalURL}
                  />
                  <GithubLink token={proposalToken} />
                </Row>
              </Row>
            )}
          </>
        )}
      </RecordWrapper>
      <ModalSearchVotes
        show={showSearchVotesModal}
        onClose={handleCloseSearchVotesModal}
        proposal={proposal}
      />
    </>
  );
};

export default Proposal;
