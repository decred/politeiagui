import { classNames, StatusBar, StatusTag, Text, Icon } from "pi-ui";
import React, { useState } from "react";
import Markdown from "../Markdown";
import ModalSearchVotes from "../ModalSearchVotes";
import RecordWrapper from "../RecordWrapper";
import { getMarkdownContent, getProposalStatusTagProps, getQuorumInVotes, getStatusBarData, getVotesReceived, isAbandonedProposal, isPublicProposal, isUnreviewedProposal } from "./helpers";
import { useProposalVoteInfo } from "./hooks";
import { useLoaderContext } from "src/Appv2/Loader";
import styles from "./Proposal.module.css";
import VotesCount from "./VotesCount";

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
  const isAuthor = currentUser && currentUser.userid === userid;
  const isPublic = isPublicProposal(proposal);
  const isUnreviewed = isUnreviewedProposal(proposal);
  const isAbandoned = isAbandonedProposal(proposal);
  const isEditable = isAuthor && (isPublic || isUnreviewed) && !isVoteActive;
  const {
    voteActive: isVoteActive,
    voteTimeLeft,
    voteBlocksLeft
  } = useProposalVoteInfo(proposal);
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
          Link,
          GithubLink,
          DownloadRecord,
          Header,
          Subtitle,
          Status
        }) => (
          <>
            <Header
              title={
                <Title
                  id={`proposal-title-${proposalToken}`}
                  truncate
                  linesBeforeTruncate={2}
                  url={proposalURL}
                >
                  {name}
                </Title>
              }
              edit={isEditable && (
                <Link to={`/proposal/${proposalToken}/edit`}>
                  <Icon type="edit" className={styles.editButton} />
                </Link>  
              )}
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
            />
            {extended && (
              <Row topMarginSize="s">
                <Text id={`proposal-token-${proposalToken}`} truncate>
                  {proposalToken}
                </Text>
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
            {(isPublic || isAbandoned) && (
              <Row justify="space-between">
                <CommentsLink numOfComments={numcomments} />
                <GithubLink token={proposalToken} />
              </Row>
            )}
            {extended && (
              <Row>
                <DownloadRecord
                  fileName={proposalToken}
                  content={proposal}
                  className="margin-right-s"
                  label="Download Proposal Bundle"
                />
                {/*TODO: comment download needs to be a container imported from the comments context */}
                {isPublic && !!numcomments && (
                  <Link title="not implemented yet" to="#">
                    Download Comments Bundle
                  </Link>
                )}
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
