import { classNames, StatusBar, StatusTag, Text, useMediaQuery } from "pi-ui";
import React, { useState } from "react";
import Markdown from "../Markdown";
import ModalSearchVotes from "../ModalSearchVotes";
import RecordWrapper from "../RecordWrapper";
import IconButton from "src/componentsv2/IconButton";
import { getProposalStatusTagProps, getStatusBarData } from "./helpers";
import {
  getMarkdownContent,
  getVotesReceived,
  isAbandonedProposal,
  isPublicProposal,
  isEditableProposal,
  getQuorumInVotes,
  isVotingFinishedProposal,
  getProposalToken
} from "src/containers/Proposal/helpers";
import { useProposalVote } from "src/containers/Proposal/hooks";
import { useLoaderContext } from "src/Appv2/Loader";
import styles from "./Proposal.module.css";
import LoggedInContent from "src/componentsv2/LoggedInContent";
import VotesCount from "./VotesCount";
import DownloadComments from "src/containers/Comments/Download";
import ProposalActions from "./ProposalActions";
import { useFullImageModal } from "src/componentsv2/ProposalForm/hooks";
import { ThumbnailGrid } from "src/componentsv2/Files/Thumbnail";
import ModalFullImage from "src/componentsv2/ModalFullImage";
import VersionPicker from "src/componentsv2/VersionPicker";
import { useRouter } from "src/componentsv2/Router";

const ProposalWrapper = props => {
  const voteProps = useProposalVote(getProposalToken(props.proposal));
  const { currentUser } = useLoaderContext();
  const { history } = useRouter();
  return <Proposal {...{ ...props, ...voteProps, currentUser, history }} />;
};

const Proposal = React.memo(function Proposal({
  proposal,
  extended,
  collapseBodyContent,
  voteSummary,
  voteActive: isVoteActive,
  voteTimeInWords: voteTime,
  voteBlocksLeft,
  currentUser,
  history
}) {
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
    version
  } = proposal;
  const {
    showFullImageModal,
    openFullImageModal,
    closeFullImageModal
  } = useFullImageModal();
  const hasvoteSummary = !!voteSummary && !!voteSummary.endheight;
  const proposalToken = censorshiprecord && censorshiprecord.token;
  const proposalURL = `/proposals/${proposalToken}`;
  const isPublic = isPublicProposal(proposal);
  const isVotingFinished = isVotingFinishedProposal(voteSummary);
  const isAbandoned = isAbandonedProposal(proposal);
  const isPublicAccessible = isPublic || isAbandoned;
  const isAuthor = currentUser && currentUser.userid === userid;
  const isEditable = isAuthor && isEditableProposal(proposal, voteSummary);
  const mobile = useMediaQuery("(max-width: 560px)");
  const [showSearchVotesModal, setShowSearchVotesModal] = useState(false);
  function handleCloseSearchVotesModal() {
    setShowSearchVotesModal(false);
  }
  function handleOpenSearchVotesModal() {
    setShowSearchVotesModal(true);
  }
  function goToFullProposal() {
    history.push(proposalURL);
  }
  const onClickFile = f => () => {
    openFullImageModal(f);
  };
  return (
    <>
      <RecordWrapper className={ classNames(isAbandoned && styles.abandonedProposal)}>
        {({
          Author,
          Event,
          Row,
          Title,
          CommentsLink,
          GithubLink,
          ChartsLink,
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
                  isAbandoned={isAbandoned}
                  truncate
                  linesBeforeTruncate={2}
                  url={extended ? "" : proposalURL}
                >
                  {name}
                </Title>
              }
              edit={
                isEditable && <Edit url={`/proposals/${proposalToken}/edit`} />
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
                      truncate
                    >{`version ${version}`}</Text>
                  )}
                  {extended && version > 1 && (
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
                      {...getProposalStatusTagProps(proposal, voteSummary)}
                    />
                    {(isVoteActive || isVotingFinished) && (
                      <Text
                        className={styles.timeLeft}
                        size="small"
                      >
                        {`vote end${isVoteActive ? "s" : "ed"} ${voteTime}`}
                      </Text>
                    )}
                    {isVoteActive && (
                      <>
                        <Text
                          className={classNames(
                            "hide-on-mobile",
                            styles.blocksLeft)}
                          size="small"
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
            {hasvoteSummary && (
              <Row>
                <StatusBar
                  max={getQuorumInVotes(voteSummary)}
                  status={getStatusBarData(voteSummary)}
                  markerPosition={`${voteSummary.passpercentage}%`}
                  markerTooltipText={`${voteSummary.passpercentage}% Yes votes required for approval`}
                  markerTooltipClassName={styles.statusBarTooltip}
                  renderStatusInfoComponent={
                    <VotesCount
                      isVoteActive={isVoteActive}
                      quorumVotes={getQuorumInVotes(voteSummary)}
                      votesReceived={getVotesReceived(voteSummary)}
                      onSearchVotes={handleOpenSearchVotesModal}
                    />
                  }
                />
              </Row>
            )}
            {extended && !!files.length && !collapseBodyContent && (
              <Markdown
                className={styles.markdownContainer}
                body={getMarkdownContent(files)}
              />
            )}
            {collapseBodyContent && (
              <IconButton
                type="expand"
                className="margin-top-m"
                size={"xlg"}
                onClick={goToFullProposal}
              />
            )}
            {isPublicAccessible && !extended && (
              <Row justify="space-between">
                <CommentsLink
                  numOfComments={numcomments}
                  url={`/proposals/${proposalToken}?scrollToComments=true`}
                />
                <div>
                  {(isVoteActive || isVotingFinished) && (
                    <ChartsLink token={proposalToken} />
                  )}
                  <GithubLink token={proposalToken} />
                </div>
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
                    className="margin-right-l"
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
                  {(isVoteActive || isVotingFinished) && (
                    <ChartsLink token={proposalToken} />
                  )}
                  {isPublicAccessible && <GithubLink token={proposalToken} />}
                </Row>
              </Row>
            )}
            <LoggedInContent>
              <ProposalActions proposal={proposal} voteSummary={voteSummary} />
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
});

export default ProposalWrapper;
