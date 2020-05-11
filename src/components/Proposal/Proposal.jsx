import {
  classNames,
  StatusBar,
  StatusTag,
  Text,
  useMediaQuery,
  useTheme
} from "pi-ui";
import React, { useEffect, useState, useCallback } from "react";
import Markdown from "../Markdown";
import ModalSearchVotes from "../ModalSearchVotes";
import RecordWrapper from "../RecordWrapper";
import IconButton from "src/components/IconButton";
import { getProposalStatusTagProps, getStatusBarData } from "./helpers";
import useProposalBatchWithoutRedux from "src/hooks/api/useProposalBatchWithoutRedux";
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
import {
  useProposalVote,
  useProposalURLs
} from "src/containers/Proposal/hooks";
import { useLoaderContext } from "src/containers/Loader";
import styles from "./Proposal.module.css";
import LoggedInContent from "src/components/LoggedInContent";
import ProposalsList from "../ProposalsList/ProposalsList";
import VotesCount from "./VotesCount";
import DownloadComments from "src/containers/Comments/Download";
import ProposalActions from "./ProposalActions";
import ThumbnailGrid from "src/components/Files";
import VersionPicker from "src/components/VersionPicker";
import useModalContext from "src/hooks/utils/useModalContext";
import { useRouter } from "src/components/Router";

const ProposalWrapper = (props) => {
  const {
    voteSummary,
    voteBlocksLeft,
    voteActive,
    voteEndTimestamp
  } = useProposalVote(getProposalToken(props.proposal));
  const [proposedFor, setProposedFor] = useState(null);
  const { linkto, linkedfrom } = props.proposal;
  // if linkto provided => this is a submission => fetch RFP to display link
  // else if linkedFrom is provided this is an RFP => fetch submssions batch & vote summaries to display list
  const isSubmission = !!linkto;
  const isRFP = !!linkedfrom;
  const batchTokens = isSubmission ? [linkto] : isRFP ? linkedfrom : null;
  const fetchVoteSummary = !!linkedfrom;
  const [proposals, voteSummaries] = useProposalBatchWithoutRedux(
    batchTokens,
    true,
    fetchVoteSummary
  );
  useEffect(() => {
    if (linkto && proposals && proposals[0]) {
      const rfpProposal = proposals[0];
      setProposedFor(rfpProposal && rfpProposal.name);
    }
  }, [linkto, proposals]);
  const { currentUser } = useLoaderContext();
  const { history } = useRouter();
  return (
    <Proposal
      {...{
        ...props,
        voteSummary,
        voteBlocksLeft,
        voteActive,
        voteEndTimestamp,
        currentUser,
        history,
        proposedFor,
        rfpSubmissions: linkedfrom && {
          proposals,
          voteSummaries
        }
      }}
    />
  );
};

const Proposal = React.memo(function Proposal({
  proposal,
  extended,
  collapseBodyContent,
  voteSummary,
  voteActive: isVoteActive,
  voteEndTimestamp,
  voteBlocksLeft,
  currentUser,
  history,
  proposedFor,
  rfpSubmissions
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
    version,
    linkby,
    linkto
  } = proposal;
  const isRfp = !!linkby;
  const isRfpSubmission = !!linkto;
  const isNotExtendedRfpOrSubmission = (isRfp || isRfpSubmission) && !extended;
  const hasvoteSummary = !!voteSummary && !!voteSummary.endheight;
  const proposalToken = censorshiprecord && censorshiprecord.token;
  const {
    proposalURL,
    authorURL,
    commentsURL,
    rfpProposalURL
  } = useProposalURLs(proposalToken, userid, isRfpSubmission, linkto);
  const isPublic = isPublicProposal(proposal);
  const isVotingFinished = isVotingFinishedProposal(voteSummary);
  const isAbandoned = isAbandonedProposal(proposal);
  const isPublicAccessible = isPublic || isAbandoned;
  const isAuthor = currentUser && currentUser.userid === userid;
  const isEditable = isAuthor && isEditableProposal(proposal, voteSummary);
  const mobile = useMediaQuery("(max-width: 560px)");
  const showEditedDate =
    version > 1 && timestamp !== publishedat && !abandonedat && !mobile;
  const showPublishedDate = publishedat && !mobile;
  const showExtendedVersionPicker = extended && version > 1;
  const showAbandonedDate = abandonedat && !mobile;
  const showVersionAsText = version > 1 && !extended && !mobile;
  const showRfpSubmissions = extended && !!rfpSubmissions;

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const openSearchVotesModal = () => {
    handleOpenModal(ModalSearchVotes, {
      onClose: handleCloseModal,
      proposal
    });
  };

  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

  const goToFullProposal = useCallback(() => {
    history.push(proposalURL);
  }, [history, proposalURL]);
  return (
    <>
      <RecordWrapper
        className={classNames(
          isAbandoned && styles.abandonedProposal,
          isNotExtendedRfpOrSubmission && styles.rfpProposal
        )}>
        {({
          Author,
          Event,
          Row,
          Title,
          RfpProposalLink,
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
              isRfp={isRfp}
              isRfpSubmission={isRfpSubmission}
              rfpProposalLink={
                <RfpProposalLink url={rfpProposalURL} rfpTitle={proposedFor} />
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
                      <Event
                        event={`vote end${isVoteActive ? "s" : "ed"}`}
                        timestamp={voteEndTimestamp}
                        className={styles.timeLeft}
                        size="small"
                      />
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
                      onSearchVotes={openSearchVotesModal}
                    />
                  }
                />
              </Row>
            )}
            {showRfpSubmissions && <ProposalsList data={rfpSubmissions} />}
            {extended && !!files.length && !collapseBodyContent && (
              <Markdown
                className={classNames(
                  styles.markdownContainer,
                  isDarkTheme && "dark",
                  showRfpSubmissions && styles.rfpMarkdownContainer
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
                <CommentsLink numOfComments={numcomments} url={commentsURL} />
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
              <Row className={styles.lastRow} justify="space-between">
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
    </>
  );
});

export default ProposalWrapper;
