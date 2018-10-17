import React from "react";
import TimeAgo from "timeago-react";
import ProposalImages from "../ProposalImages";
import DownloadBundle from "../DownloadBundle";
import Message from "../Message";
import actions from "../../connectors/actions";
import thingLinkConnector from "../../connectors/thingLink";
import {
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED
} from "../../constants";
import { getProposalStatus } from "../../helpers";
import VoteStats from "../VoteStats";
import { withRouter } from "react-router-dom";
import ButtonWithLoadingIcon from "./ButtonWithLoadingIcon";
import Tooltip from "../Tooltip";
import * as modalTypes from "../Modal/modalTypes";
import CensorMessage from "../CensorMessage";

const ThingLinkComp = ({
  Link,
  Expando,
  id,
  expanded = false,
  name,
  author,
  authorid,
  censorMessage,
  domain,
  rank = 0,
  userid,
  draftId,
  version,
  subreddit,
  subreddit_id,
  created_utc,
  title,
  url,
  permalink,
  is_self,
  selftext,
  selftext_html,
  thumbnail,
  otherFiles,
  review_status,
  numcomments,
  lastSubmitted,
  loggedInAsEmail,
  isAdmin,
  userCanExecuteActions,
  onChangeStatus,
  onStartVote,
  onAuthorizeVote,
  onRevokeVote,
  setStatusProposalToken,
  onDeleteDraftProposal,
  setStatusProposalError,
  isTestnet,
  getVoteStatus,
  confirmWithModal,
  userId,
  comments,
  authorizeVoteToken,
  isRequestingAuthorizeVote,
  authorizeVoteError,
  isRequestingStartVote,
  startVoteToken,
  startVoteError,
  isApiRequestingSetProposalStatusByToken
}) => {
  const voteStatus = getVoteStatus(id) && getVoteStatus(id).status;
  const isUnvetted = review_status === PROPOSAL_STATUS_UNREVIEWED || review_status === PROPOSAL_STATUS_UNREVIEWED_CHANGES;
  const displayVersion = review_status === PROPOSAL_STATUS_PUBLIC;
  const isVotingActiveOrFinished = voteStatus === PROPOSAL_VOTING_ACTIVE || voteStatus === PROPOSAL_VOTING_FINISHED;
  const isEditable = authorid === userId && !isVotingActiveOrFinished && review_status !== PROPOSAL_STATUS_CENSORED && voteStatus !== PROPOSAL_VOTING_AUTHORIZED;
  const disableEditButton = authorid === userId && voteStatus === PROPOSAL_VOTING_AUTHORIZED;
  const hasBeenUpdated = review_status === PROPOSAL_STATUS_UNREVIEWED_CHANGES || parseInt(version, 10) > 1;
  const currentUserIsTheAuthor = authorid === userId;
  const userCanAuthorizeTheVote = currentUserIsTheAuthor && voteStatus === PROPOSAL_VOTING_NOT_AUTHORIZED;
  const userCanRevokeVote = currentUserIsTheAuthor && voteStatus === PROPOSAL_VOTING_AUTHORIZED;
  const adminCanStartTheVote = isAdmin && voteStatus === PROPOSAL_VOTING_AUTHORIZED && ((authorid !== userid) || isTestnet);
  const enableAdminActionsForUnvetted = isAdmin && isUnvetted && ((authorid !== userid) || isTestnet);
  const hasAuthoredComment = () => {
    for (const c of comments) {
      if (c.userid === userId) return true;
    }
    return false;
  };

  // errors
  const errorSetStatus = (setStatusProposalToken === id && setStatusProposalError);
  const errorAuthorizeVote = (authorizeVoteToken === id && authorizeVoteError);
  const errorStartVote =  (startVoteToken === id && startVoteError);
  const allErrors = [ errorSetStatus, errorAuthorizeVote, errorStartVote ];

  // loading flags
  const loadingStartVote = isRequestingStartVote && startVoteToken === id;
  const loadingAuthorizeVote = isRequestingAuthorizeVote && authorizeVoteToken === id;

  const status = isApiRequestingSetProposalStatusByToken(id);
  const loadingCensor = status && status === PROPOSAL_STATUS_CENSORED;
  const loadingApprove = status && status === PROPOSAL_STATUS_PUBLIC;

  return (
    <div
      className={`thing thing-proposal id-${id} odd link ${
        review_status === PROPOSAL_STATUS_CENSORED ? "spam" : null
      }`}
      data-author={author}
      data-author-fullname=""
      data-domain={domain}
      data-fullname={name}
      data-rank={rank}
      data-subreddit={subreddit}
      data-subreddit-fullname={subreddit_id}
      data-timestamp={created_utc}
      data-type="link"
      data-url={url}
      id={`thing_${name}`}
    >
      <p className="parent" />
      {thumbnail &&
        ![ "image", "default", "nsfw", "self" ].find(sub => sub === thumbnail) ? (
          <Link className="thumbnail may-blank loggedin" href={url}>
            <img alt="Thumb" height={70} src={thumbnail} width={70} />
          </Link>
        ) : null}
      {is_self ? <Link className="thumbnail self may-blank" href={url} /> : null}
      <div className="entry unvoted">
        <span className="title" style={{ display: "flex" }}>
          <Link className="title may-blank loggedin" href={url} tabIndex={rank}>
            {title} {review_status === PROPOSAL_STATUS_UNREVIEWED_CHANGES ?
              <span className="font-12 warning-color">(edited)</span> : null}
          </Link>{" "}
          {domain ? (
            <span className="domain">
              (<Link href={`/domain/${domain}/`}>{domain}</Link>)
            </span>
          ) : null}
          <div style={{ flex: "1", display: "flex", justifyContent: "flex-end" }}>
            {isEditable ?
              <Link
                href={`/proposals/${id}/edit`}
                className="edit-proposal"
                onClick={() => null}>
                <i className="fa fa-edit right-margin-5" />
                Edit
              </Link>
              : disableEditButton ?
                <Tooltip
                  text="Revoke vote authorization to edit your proposal again."
                  position="bottom"
                >
                  <span style={{ color: "#777" }}>
                    <i className="fa fa-edit right-margin-5" />
                  Edit
                  </span>
                </Tooltip>
                : null}
          </div>
        </span>
        <span className="tagline">
          <span className="submitted-by">
            {hasBeenUpdated ? "updated " : "submitted "}
            <Tooltip
              text={new Date(created_utc * 1000).toLocaleString()}
              wrapperStyle={{
                display: "inline"
              }}
              tipStyle={{
                right: "-10px",
                top: "20px",
                width: "100px",
                textAlign: "center"
              }}>
              <TimeAgo
                style={{ cursor: "pointer" }}
                datetime={created_utc * 1000}
              />
            </Tooltip>
            {author &&
              <span>
                {" by "}
                <Link href={`/user/${authorid}`}>{author}</Link>
              </span>
            }
            {displayVersion && version ? ` - version ${version}` : null}
            {numcomments > 0 &&
              <span> - {numcomments}{numcomments === 1 ? " comment" : " comments"} </span>
            }
          </span>
        </span>
        {!draftId && (
          <p className="tagline proposal-token">
            {id} • {getProposalStatus(review_status)}
          </p>
        )}
        {draftId && (
          <div className="tagline proposal-draft">
            Saved as draft
            <span
              className="delete-draft"
              onClick={() => {
                confirmWithModal(modalTypes.CONFIRM_ACTION,
                  { message: "Are you sure you want to delete this draft?" }).then(
                  ok => ok && onDeleteDraftProposal(draftId)
                );
              }}>
              <i className="fa fa-trash" />
              Delete
            </span>
          </div>
        )}
        {
          review_status === 4 &&
          <VoteStats token={id} />
        }
        {expanded &&
          (lastSubmitted === id ? (
            <Message height="80px" type="info">
              <span>
                <p
                  style={{
                    marginTop: "0.4166667em",
                    marginBottom: "0.4166667em"
                  }}
                >
                  Your proposal has been created, but it will not be public
                until an admin approves it. You can{" "}
                  <DownloadBundle message="download your proposal" type="proposal"/> and use
                the{" "}
                  <a
                    href="https://github.com/decred/politeia/tree/master/politeiad/cmd/politeia_verify"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    politeia_verify tool
                  </a>{" "}
                  to prove that your submission has been accepted for review by
                  Politeia. If your proposal is censored by an admin, you won't be
                  able to access it's contents.

                </p>
              </span>
            </Message>
          ) : hasAuthoredComment() ? (
            <div>
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <DownloadBundle type="proposal" />
              </div>
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <DownloadBundle type="comments" />
              </div>
            </div>)
            : (
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <DownloadBundle type="proposal" /> <br></br>
              </div>
            ))}
        {censorMessage && <CensorMessage message={censorMessage} />}
        <Expando {...{ expanded, is_self, selftext, selftext_html }} />
        <ProposalImages readOnly files={otherFiles} />
        <ul className="flat-list buttons">
          <li className="first">
            <Link
              className="bylink comments may-blank"
              data-event-action="comments"
              href={permalink}
            >
              permalink
            </Link>
          </li>
          <li>
            <a
              href={isTestnet ? `https://github.com/decred-proposals/testnet3/tree/master/${id}/1` : `https://github.com/decred-proposals/mainnet/tree/master/${id}/1`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get this Proposal on GitHub
            </a>
          </li>
          {enableAdminActionsForUnvetted ?
            [
              <li key="spam">
                <ButtonWithLoadingIcon
                  className={`c-btn c-btn-primary${!userCanExecuteActions ? " not-active disabled" : ""}`}
                  onClick={e => confirmWithModal(modalTypes.CONFIRM_ACTION_WITH_REASON, {
                    reasonPlaceholder: "Please provide a reason to censor this proposal"
                  }).then(
                    ({ reason, confirm }) => confirm && onChangeStatus(
                      authorid,
                      loggedInAsEmail,
                      id,
                      PROPOSAL_STATUS_CENSORED,
                      reason
                    )
                  ) && e.preventDefault()}
                  text="Spam"
                  data-event-action="spam"
                  isLoading={loadingCensor}
                />
              </li>,
              <li key="approve">
                <ButtonWithLoadingIcon
                  className={`c-btn c-btn-primary${!userCanExecuteActions ? " not-active disabled" : ""}`}
                  onClick={e =>
                    confirmWithModal(modalTypes.CONFIRM_ACTION, {
                      message: "Are you sure you want to publish this proposal?"
                    }).then(
                      confirm => confirm &&
                        onChangeStatus(
                          authorid,
                          loggedInAsEmail,
                          id,
                          PROPOSAL_STATUS_PUBLIC
                        )
                    ) && e.preventDefault()
                  }
                  text="approve"
                  data-event-action="approve"
                  isLoading={loadingApprove}
                />
              </li>
            ] : null
          }
          {adminCanStartTheVote ?
            <li key="start-vote">
              <ButtonWithLoadingIcon
                className={`c-btn c-btn-primary${!userCanExecuteActions ? " not-active disabled" : ""}`}
                onClick={e =>
                  onStartVote(
                    loggedInAsEmail,
                    id
                  ) && e.preventDefault()
                }
                text="Start Vote"
                data-event-action="start-vote"
                isLoading={loadingStartVote}
              />
            </li> : null
          }
          {
            userCanAuthorizeTheVote ?
              <li>
                <ButtonWithLoadingIcon
                  className={`c-btn c-btn-primary${!userCanExecuteActions ? " not-active disabled" : ""}`}
                  onClick={e =>
                    confirmWithModal(modalTypes.CONFIRM_ACTION, {
                      message: (<span>Are you sure you want to <b>authorize</b> the admins to start the voting for this proposal?</span>)
                    }).then(
                      confirm => confirm &&
                        onAuthorizeVote(
                          loggedInAsEmail,
                          id,
                          version
                        )
                    ) && e.preventDefault()
                  }
                  text="Authorize voting to start"
                  data-event-action="authorize-vote"
                  isLoading={loadingAuthorizeVote}
                />
              </li>
              : userCanRevokeVote ?
                <li>
                  <ButtonWithLoadingIcon
                    className={`c-btn c-btn-primary${!userCanExecuteActions ? " not-active disabled" : ""}`}
                    onClick={e =>
                      confirmWithModal(modalTypes.CONFIRM_ACTION, {
                        message: (<span>Are you sure you want to <b>revoke</b> the start voting authorization for this proposal?</span>)
                      }).then(
                        confirm => confirm &&
                        onRevokeVote(
                          loggedInAsEmail,
                          id,
                          version
                        )
                      ) && e.preventDefault()
                    }
                    text="Revoke voting authorization"
                    data-event-action="revoke-vote"
                    isLoading={loadingAuthorizeVote}
                  />
                </li>
                : null
          }
        </ul>
        {allErrors.map((error, idx) => error ?
          <Message
            key={`error-${idx}`}
            type="error"
            header="Error setting proposal status"
            body={error}
          /> : null
        )}
      </div>
      <div className="child" />
      <div className="clearleft" />
    </div>
  );
};

export const ThingLink = actions(ThingLinkComp);

export default thingLinkConnector(withRouter(ThingLink));
