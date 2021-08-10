import {
  classNames,
  StatusBar,
  StatusTag,
  Text,
  useMediaQuery,
  useTheme,
  Tooltip,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import React, { useMemo } from "react";
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
  isCensoredProposal,
  isPublicProposal,
  isActiveRfp,
  isEditableProposal,
  getQuorumInVotes,
  isVotingFinishedProposal,
  getProposalToken,
  isVotingAuthorizedProposal,
  goToFullProposal
} from "src/containers/Proposal/helpers";
import {
  useProposalVote,
  useProposalURLs
} from "src/containers/Proposal/hooks";
import { useLoaderContext } from "src/containers/Loader";
import { useLoader } from "src/containers/Loader";
import styles from "./Proposal.module.css";
import LoggedInContent from "src/components/LoggedInContent";
import ProposalsList from "../ProposalsList/ProposalsList";
import VotesCount from "./VotesCount";
import DownloadComments from "src/containers/Comments/Download";
import DownloadCommentsTimestamps from "src/containers/Comments/Download/DownloadCommentsTimestamps";
import DownloadVotesTimestamps from "src/containers/Proposal/Download/DownloadVotesTimestamps";
import ProposalActions from "./ProposalActions";
import ThumbnailGrid from "src/components/Files";
import VersionPicker from "src/components/VersionPicker";
import useModalContext from "src/hooks/utils/useModalContext";
import { useRouter } from "src/components/Router";
import { shortRecordToken, isEmpty, getKeyByValue } from "src/helpers";
import { usdFormatter } from "src/utils";

/**
 * replaceImgDigestWithPayload uses a regex to parse images
 * @param {String} text the markdown description
 * @param {Map} files a files array
 * @returns {object} { text, markdownFiles }
 */
function replaceImgDigestWithPayload(text, files) {
  const imageRegexParser =
    /!\[[^\]]*\]\((?<digest>.*?)(?="|\))(?<optionalpart>".*")?\)/g;
  const imgs = text.matchAll(imageRegexParser);
  let newText = text;
  const markdownFiles = [];
  /**
   * This for loop will update the newText replacing images digest by their
   * base64 payload and push the img object to an array of markdownFiles.
   * */
  for (const img of imgs) {
    const { digest } = img.groups;
    const obj = getKeyByValue(files, digest);
    if (obj) {
      markdownFiles.push(obj);
      newText = newText.replace(
        digest,
        `data:${obj.mime};base64,${obj.payload}`
      );
    }
  }
  return { text: newText, markdownFiles };
}

const ProposalWrapper = (props) => {
  const { voteSummary, voteBlocksLeft, voteActive, voteEndTimestamp } =
    useProposalVote(getProposalToken(props.proposal));
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
    publishedat,
    abandonedat,
    censoredat,
    timestamp,
    userid,
    username,
    version,
    linkby,
    linkto,
    proposedFor,
    type,
    rfpSubmissions,
    state,
    commentsCount,
    statuschangemsg,
    statuschangeusername,
    amount,
    domain,
    startDate,
    endDate
  } = proposal;
  const isRfp = !!linkby || type === PROPOSAL_TYPE_RFP;
  const isRfpSubmission = !!linkto || type === PROPOSAL_TYPE_RFP_SUBMISSION;
  const isRfpActive = isRfp && isActiveRfp(linkby);
  const isNotExtendedRfpOrSubmission = (isRfp || isRfpSubmission) && !extended;
  const hasVoteSummary = !!voteSummary && !!voteSummary.endblockheight;
  const proposalToken = censorshiprecord && censorshiprecord.token;
  const votesCount = !!voteSummary && getVotesReceived(voteSummary);
  const {
    proposalURL,
    authorURL,
    commentsURL,
    // TODO: remove legacy
    isLegacy,
    rfpProposalURL,
    legacyRfpName
  } = useProposalURLs(proposalToken, userid, isRfpSubmission, linkto);
  const isPublic = isPublicProposal(proposal);
  const isVotingFinished = isVotingFinishedProposal(voteSummary);
  const isAbandoned = isAbandonedProposal(proposal);
  const isCensored = isCensoredProposal(proposal);
  const isPublicAccessible = isPublic || isAbandoned || isCensored;
  const isAuthor = currentUser && currentUser.username === username;
  const isVotingAuthorized = isVotingAuthorizedProposal(voteSummary);
  const isEditable =
    isAuthor && isEditableProposal(proposal, voteSummary) && !isLegacy;
  const { apiInfo } = useLoader();
  const mobile = useMediaQuery("(max-width: 560px)");
  const showEditedDate =
    version > 1 &&
    timestamp !== publishedat &&
    !abandonedat &&
    !censoredat &&
    !mobile;
  const showPublishedDate = publishedat && !mobile;
  const showExtendedVersionPicker = extended && version > 1;
  const showAbandonedDate = abandonedat && !mobile;
  const showCensoredDate = censoredat && !mobile;
  const showVersionAsText = version > 1 && !extended && !mobile;
  const showRfpSubmissions =
    extended &&
    !!rfpSubmissions &&
    !isEmpty(rfpSubmissions.proposals) &&
    !isEmpty(rfpSubmissions.voteSummaries);
  const showEditIcon =
    isAuthor &&
    isVotingAuthorized &&
    !isVotingFinished &&
    !isVoteActive &&
    isPublic;

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const openSearchVotesModal = () => {
    handleOpenModal(ModalSearchVotes, {
      onClose: handleCloseModal,
      proposal
    });
  };

  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;

  const rawMarkdown = getMarkdownContent(files);
  const { text, markdownFiles } = useMemo(
    () => replaceImgDigestWithPayload(rawMarkdown, files),
    [files, rawMarkdown]
  );

  return (
    <>
      <RecordWrapper
        id={proposalToken}
        className={classNames(
          (isAbandoned || isCensored) && styles.abandonedProposal,
          isNotExtendedRfpOrSubmission && styles.rfpProposal
        )}>
        {({
          Author,
          Event,
          Row,
          Title,
          RfpProposalLink,
          CommentsLink,
          ChartsLink,
          CopyLink,
          MarkdownLink,
          DownloadRecord,
          DownloadTimestamps,
          DownloadVotes,
          LinkSection,
          Header,
          Subtitle,
          Edit,
          Status,
          RecordToken,
          Metadata
        }) => (
          <>
            <Header
              title={
                <Title
                  id={`proposal-title-${proposalToken}`}
                  truncate
                  isLegacy={isLegacy}
                  linesBeforeTruncate={2}
                  url={extended ? "" : proposalURL}>
                  {name || proposalToken}
                </Title>
              }
              /**
               * if the proposal is editable: show Edit icon
               * if the proposal is not editable and the voting is
               * authorized: show Edit icon wrapped by tooltip
               * otherwise: do not show Edit icon
               * */
              edit={
                isEditable ? (
                  <Edit
                    url={`/record/${shortRecordToken(proposalToken)}/edit`}
                  />
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
                <RfpProposalLink
                  url={rfpProposalURL}
                  rfpTitle={isLegacy ? legacyRfpName : proposedFor}
                  isLegacy={isLegacy}
                />
              }
              subtitle={
                <Subtitle>
                  <Author
                    username={username}
                    url={authorURL}
                    isLegacy={isLegacy}
                  />
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
                  {showCensoredDate && (
                    <Event
                      event="censored"
                      timestamp={censoredat}
                      username={statuschangeusername}
                    />
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
                      proposalState={state}
                    />
                  )}
                </Subtitle>
              }
              status={
                (isPublic || isAbandoned || isCensored) && (
                  <Status>
                    <StatusTag
                      className={styles.statusTag}
                      {...getProposalStatusTagProps(
                        proposal,
                        voteSummary,
                        isDarkTheme
                      )}
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
            {hasVoteSummary && (
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
                      onSearchVotes={!isLegacy ? openSearchVotesModal : null}
                    />
                  }
                />
              </Row>
            )}
            {showRfpSubmissions && <ProposalsList data={rfpSubmissions} />}
            {extended && (
              <Metadata
                amount={amount && usdFormatter.format(amount)}
                startDate={startDate}
                endDate={endDate}
                domain={domain}
                isRFP={isRfp}
              />
            )}
            {extended && files && !!files.length && !collapseBodyContent && (
              <Markdown
                className={classNames(
                  styles.markdownContainer,
                  isDarkTheme && "dark",
                  showRfpSubmissions && styles.rfpMarkdownContainer
                )}
                body={text}
              />
            )}
            {extended && isCensored && !collapseBodyContent && (
              <Markdown
                className={classNames(
                  styles.markdownContainer,
                  isDarkTheme && "dark",
                  showRfpSubmissions && styles.rfpMarkdownContainer
                )}
                body={statuschangemsg}
              />
            )}
            {collapseBodyContent && (
              <IconButton
                type="expand"
                className="margin-top-m"
                size="xlg"
                onClick={goToFullProposal(history, proposalURL)}
              />
            )}
            {isPublicAccessible && !extended && (
              <Row justify="space-between">
                <CommentsLink
                  numOfComments={commentsCount}
                  url={commentsURL}
                  isLegacy={isLegacy}
                />
                <div>
                  {(isVoteActive || isVotingFinished) && (
                    <ChartsLink token={proposalToken} />
                  )}
                </div>
                {extended && (
                  <MarkdownLink
                    to={`/record/${shortRecordToken(proposalToken)}/raw`}
                  />
                )}
              </Row>
            )}
            {extended && files.length > 1 && (
              <Row className={styles.filesRow} justify="left" topMarginSize="s">
                <ThumbnailGrid
                  value={files.filter((file) => !markdownFiles.includes(file))}
                  viewOnly={true}
                />
              </Row>
            )}
            {extended && (
              <Row className={styles.lastRow} justify="space-between">
                <LinkSection
                  className={styles.downloadLinksWrapper}
                  title="Available Downloads">
                  <DownloadRecord
                    fileName={`${proposalToken}-v${version}`}
                    content={proposal}
                    serverpublickey={apiInfo.pubkey}
                    label="Proposal Bundle"
                  />
                  <DownloadTimestamps
                    label="Proposal Timestamps"
                    token={proposalToken}
                    version={version}
                    state={state}
                  />
                  {isPublic && commentsCount > 0 && (
                    <DownloadComments
                      label="Comments Bundle"
                      recordToken={proposalToken}
                    />
                  )}
                  {isPublic && commentsCount > 0 && (
                    <DownloadCommentsTimestamps
                      label="Comments Timestamps"
                      recordToken={proposalToken}
                      commentsCount={commentsCount}
                    />
                  )}
                  {votesCount > 0 && (
                    <DownloadVotes
                      label="Votes Bundle"
                      fileName={`${proposalToken}-votes`}
                      serverpublickey={apiInfo.pubkey}
                      token={proposalToken}
                    />
                  )}
                  {votesCount > 0 && (
                    <DownloadVotesTimestamps
                      label="Votes Timestamp"
                      votesCount={votesCount}
                      recordToken={proposalToken}
                    />
                  )}
                </LinkSection>
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
                  {extended && (
                    <MarkdownLink
                      to={`/record/${shortRecordToken(proposalToken)}/raw`}
                    />
                  )}
                </Row>
              </Row>
            )}
            <LoggedInContent>
              <ProposalActions
                proposal={proposal}
                voteSummary={voteSummary}
                rfpSubmissionsVoteSummaries={
                  isRfp && rfpSubmissions && rfpSubmissions.voteSummaries
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
