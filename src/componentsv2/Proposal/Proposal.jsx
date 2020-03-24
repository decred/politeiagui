import {
  classNames,
  StatusBar,
  StatusTag,
  Text,
  useMediaQuery,
  useTheme
} from "pi-ui";
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
import useProposalVote from "src/containers/Proposal/hooks/useProposalVote";
import { useLoaderContext } from "src/containers/Loader";
import styles from "./Proposal.module.css";
import LoggedInContent from "src/componentsv2/LoggedInContent";
import VotesCount from "./VotesCount";
import DownloadComments from "src/containers/Comments/Download";
import ProposalActions from "./ProposalActions";
import ThumbnailGrid from "src/componentsv2/Files";
import VersionPicker from "src/componentsv2/VersionPicker";
import { useRouter } from "src/componentsv2/Router";
import { useConfig } from "src/containers/Config";

const ProposalWrapper = (props) => {
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
  const { javascriptEnabled } = useConfig();

  const hasvoteSummary = !!voteSummary && !!voteSummary.endheight;
  const proposalToken = censorshiprecord && censorshiprecord.token;
  const proposalURL = javascriptEnabled ?
    `/proposals/${proposalToken}` : `/nojavascript/proposals/${proposalToken}`;
  const commentsURL = javascriptEnabled ?
    `/proposals/${proposalToken}?scrollToComments=true` :
    `/nojavascript/proposals/${proposalToken}${encodeURIComponent("?scrollToComments=true")}`;
  const authorURL = javascriptEnabled ?
    `/user/${userid}` : `/nojavascript/user/${userid}`;
  const isPublic = isPublicProposal(proposal);
  const isVotingFinished = isVotingFinishedProposal(voteSummary);
  const isAbandoned = isAbandonedProposal(proposal);
  const isPublicAccessible = isPublic || isAbandoned;
  const isAuthor = currentUser && currentUser.userid === userid;
  const isEditable = isAuthor && isEditableProposal(proposal, voteSummary);
  const mobile = useMediaQuery("(max-width: 560px)");
  const [showSearchVotesModal, setShowSearchVotesModal] = useState(false);
  const showEditedDate =
    version > 1 && timestamp !== publishedat && !abandonedat && !mobile;
  const showPublishedDate = publishedat && !mobile;
  const showExtendedVersionPicker = extended && version > 1;
  const showAbandonedDate = abandonedat && !mobile;
  const showVersionAsText = version > 1 && !extended && !mobile;

  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

  function handleCloseSearchVotesModal() {
    setShowSearchVotesModal(false);
  }
  function handleOpenSearchVotesModal() {
    setShowSearchVotesModal(true);
  }
  function goToFullProposal() {
    history.push(proposalURL);
  }
  return (
    <>
      <RecordWrapper
        className={classNames(isAbandoned && styles.abandonedProposal)}>
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
                  url={extended ? "" : proposalURL}>
                  {name}
                </Title>
              }
              edit={
                isEditable && <Edit url={`/proposals/${proposalToken}/edit`} />
              }
              subtitle={
                <Subtitle>
                  <Author username={username} url={authorURL} />
                  {showPublishedDate && (
                    <Event event="published" timestamp={publishedat} />
                  )}
                  {showEditedDate && (
                    <Event event="edited" timestamp={timestamp} />
                  )}
                  {showAbandonedDate && (
                    <Event event={"abandoned"} timestamp={abandonedat} />
                  )}
                  {showVersionAsText && (
                    <Text
                      id={`proposal-${proposalToken}-version`}
                      className={styles.version}
                      truncate>{`version ${version}`}</Text>
                  )}
                  {showExtendedVersionPicker && (
                    <VersionPicker
                      className={classNames(
                        styles.versionPicker,
                        isDarkTheme && styles.darkVersionPicker
                      )}
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
                      <Text className={styles.timeLeft} size="small">
                        {`vote end${isVoteActive ? "s" : "ed"} ${voteTime}`}
                      </Text>
                    )}
                    {isVoteActive && (
                      <>
                        <Text
                          className={classNames(
                            "hide-on-mobile",
                            styles.blocksLeft
                          )}
                          size="small">
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
                className={classNames(
                  styles.markdownContainer,
                  isDarkTheme && "dark"
                )}
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
                  url={commentsURL}
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
                <ThumbnailGrid value={files} viewOnly={true} />
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
                    className={classNames(
                      isPublicAccessible && styles.copyLink
                    )}
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
    </>
  );
});

export default ProposalWrapper;
