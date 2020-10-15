import {
  classNames,
  StatusBar,
  StatusTag,
  Text,
  useMediaQuery,
  useTheme,
  Tooltip
} from "pi-ui";
import React from "react";
import Markdown from "../Markdown";
import ModalSearchVotes from "../ModalSearchVotes";
import RecordWrapper from "../RecordWrapper";
import IconButton from "src/components/IconButton";
import { getProposalStatusTagProps, getStatusBarData } from "./helpers";
import { PROPOSAL_TYPE_RFP, PROPOSAL_TYPE_RFP_SUBMISSION } from "src/constants";
import {
  getMarkdownContent,
  getVotesReceived,
  isAbandonedProposal,
  isPublicProposal,
  isActiveRfp,
  isEditableProposal,
  getQuorumInVotes,
  isVotingFinishedProposal,
  getProposalToken,
  isVotingNotAuthorizedProposal,
  goToFullProposal
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
import { isEmpty } from "src/helpers";

const getKeyByValue = (obj, val) =>
  Object.values(obj).find((value) => value.digest === val);

function replaceImgDigestWithPayload(text, files) {
  const imageRegexParser = /!\[[^\]]*\]\((?<digest>.*?)(?="|\))(?<optionalpart>".*")?\)/g;
  const imgs = text.matchAll(imageRegexParser);
  let newText = text;
  const filesOnMd = [];
  for (const img of imgs) {
    const { digest } = img.groups;
    const obj = getKeyByValue(files, digest);
    if (obj) {
      filesOnMd.push(obj);
      newText = newText.replace(
        digest,
        `data:${obj.mime};base64,${obj.payload}`
      );
    }
  }
  return { text: newText, filesOnMd };
}

const ProposalWrapper = (props) => {
  const {
    voteSummary,
    voteBlocksLeft,
    voteActive,
    voteEndTimestamp
  } = useProposalVote(getProposalToken(props.proposal));

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
        history
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
    version,
    linkby,
    linkto,
    proposedFor,
    type,
    rfpSubmissions
  } = proposal;
  const isRfp = !!linkby || type === PROPOSAL_TYPE_RFP;
  const isRfpSubmission = !!linkto || type === PROPOSAL_TYPE_RFP_SUBMISSION;
  const isRfpActive = isRfp && isActiveRfp(linkby);
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
  const isVotingAuthorized = !isVotingNotAuthorizedProposal(voteSummary);
  const isEditable = isAuthor && isEditableProposal(proposal, voteSummary);
  const mobile = useMediaQuery("(max-width: 560px)");
  const showEditedDate =
    version > 1 && timestamp !== publishedat && !abandonedat && !mobile;
  const showPublishedDate = publishedat && !mobile;
  const showExtendedVersionPicker = extended && version > 1;
  const showAbandonedDate = abandonedat && !mobile;
  const showVersionAsText = version > 1 && !extended && !mobile;
  const showRfpSubmissions =
    extended &&
    !!rfpSubmissions &&
    !isEmpty(rfpSubmissions.proposals) &&
    !isEmpty(rfpSubmissions.voteSummaries);
  const showEditIcon =
    currentUser && isVotingAuthorized && !isVotingFinished && !isVoteActive;

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const openSearchVotesModal = () => {
    handleOpenModal(ModalSearchVotes, {
      onClose: handleCloseModal,
      proposal
    });
  };

  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

  const { text, filesOnMd } = replaceImgDigestWithPayload(
    getMarkdownContent(files),
    files
  );

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
              /**
               * if the proposal is editable: show Edit icon
               * if the proposal is not editable and the voting is authorized: show Edit icon wrapped by tooltip
               * otherwise: do not show Edit icon
               * */
              edit={
                isEditable ? (
                  <Edit url={`/proposals/${proposalToken}/edit`} />
                ) : showEditIcon ? (
                  <Tooltip
                    placement={mobile ? "left" : "right"}
                    content="You have to revoke the voting authorization to edit the proposal"
                    className={styles.disabled}
                    contentClassName={styles.authorizeTooltip}>
                    <Edit tabIndex={-1} />
                  </Tooltip>
                ) : null
              }
              isRfp={isRfp}
              isRfpSubmission={isRfpSubmission}
              rfpProposalLink={
                <RfpProposalLink url={rfpProposalURL} rfpTitle={proposedFor} />
              }
              subtitle={
                <Subtitle>
                  <Author username={username} url={authorURL} />
                  {isRfp && linkby && (
                    <Event
                      event={`${isRfpActive ? "expires" : "expired"}`}
                      timestamp={linkby}
                    />
                  )}
                  {showPublishedDate && (
                    <Event event="published" timestamp={publishedat} />
                  )}
                  {showEditedDate && (
                    <Event event="edited" timestamp={timestamp} />
                  )}
                  {showAbandonedDate && (
                    <Event event="abandoned" timestamp={abandonedat} />
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
                          {`${voteBlocksLeft} block${
                            voteBlocksLeft > 1 ? "s" : ""
                          } left`}
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
                <RecordToken token={proposalToken} isCopyable />
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
                body={text}
              />
            )}
            {collapseBodyContent && (
              <IconButton
                type="expand"
                className="margin-top-m"
                size={"xlg"}
                onClick={goToFullProposal(history, proposalURL)}
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
                <ThumbnailGrid
                  value={files.filter((file) => !filesOnMd.includes(file))}
                  viewOnly={true}
                />
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
              <ProposalActions
                proposal={proposal}
                voteSummary={voteSummary}
                rfpSubmissionsVoteSummaries={
                  isRfp && showRfpSubmissions && rfpSubmissions.voteSummaries
                }
              />
            </LoggedInContent>
          </>
        )}
      </RecordWrapper>
    </>
  );
});

export default ProposalWrapper;
