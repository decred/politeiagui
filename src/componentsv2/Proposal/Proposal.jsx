import React from "react";
import { StatusBar, StatusTag, Text, classNames } from "pi-ui";
import RecordWrapper from "../RecordWrapper";
import {
  getStatusBarData,
  isPublicProposal,
  getProposalStatusTagProps,
  isAbandonedProposal,
  getQuorumInVotes,
  getMarkdownContent
} from "./helpers";
import { useProposalVoteInfo } from "./hooks";
import styles from "./Proposal.module.css";
import Markdown from "../Markdown";

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
  const hasVoteStatus = !!voteStatus && !!voteStatus.endheight;
  const proposalToken = censorshiprecord && censorshiprecord.token;
  const proposalURL = `/proposal/${proposalToken}`;
  const isPublic = isPublicProposal(proposal);
  const isAbandoned = isAbandonedProposal(proposal);
  const {
    voteActive: isVoteActive,
    voteTimeLeft,
    voteBlocksLeft
  } = useProposalVoteInfo(proposal);

  return (
    <RecordWrapper>
      {({
        Author,
        BaseInfo,
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
            title={<Title url={proposalURL}>{name}</Title>}
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
                    className={classNames(styles.version, "hide-on-mobile")}
                    color="gray"
                    size="small"
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
          <Row topMarginSize="s" hide={!extended}>
            <Text truncate>{proposalToken}</Text>
          </Row>
          {hasVoteStatus && (
            <Row>
              <StatusBar
                max={getQuorumInVotes(voteStatus)}
                status={getStatusBarData(voteStatus)}
                markerPosition={`${voteStatus.passpercentage}%`}
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
          <Row hide={!extended}>
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
        </>
      )}
    </RecordWrapper>
  );
};

export default Proposal;
