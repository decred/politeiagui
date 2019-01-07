import React from "react";
import { DateTooltip } from "snew-classic-ui";
import { withRouter } from "react-router-dom";
import * as modalTypes from "../Modal/modalTypes";
import actions from "../../connectors/actions";
import ButtonWithLoadingIcon from "./ButtonWithLoadingIcon";
import CensorMessage from "../CensorMessage";
import DownloadBundle from "../DownloadBundle";
import Message from "../Message";
import ProposalImages from "../ProposalImages";
import thingLinkConnector from "../../connectors/thingLink";
import Tooltip from "../Tooltip";
import VoteStats from "../VoteStats";
import VersionPicker from "../VersionPicker";
// import Diff from "./Markdown/Diff";

import {
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_NOT_AUTHORIZED
} from "../../constants";

const ToggleIcon = (type, onClick) => (
  <button className="collapse-icon-button" onClick={onClick}>
    <i className={`fa fa-${type}`} />
  </button>
);

class ThingLinkComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: !this.props.commentid
    };
  }
  hanldeExpandToggle = e => {
    e && e.preventDefault() && e.stopPropagation();
    this.setState(state => ({ expanded: !state.expanded }));
  };
  render() {
    const {
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
      publishedat,
      abandonedat,
      censoredat,
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
      openModal,
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
      isApiRequestingSetProposalStatusByToken,
      commentid
    } = this.props;
    const voteStatus = getVoteStatus(id) && getVoteStatus(id).status;
    const isAbandoned = review_status === PROPOSAL_STATUS_ABANDONED;
    const isCensored = review_status === PROPOSAL_STATUS_CENSORED;
    const isUnvetted =
      review_status === PROPOSAL_STATUS_UNREVIEWED ||
      review_status === PROPOSAL_STATUS_UNREVIEWED_CHANGES;
    const isVetted = review_status === PROPOSAL_STATUS_PUBLIC;
    const displayVersion =
      version &&
      parseInt(version, 10) > 1 &&
      review_status === PROPOSAL_STATUS_PUBLIC;
    const isVotingActiveOrFinished =
      voteStatus === PROPOSAL_VOTING_ACTIVE ||
      voteStatus === PROPOSAL_VOTING_FINISHED;
    const isEditable =
      authorid === userId &&
      !isVotingActiveOrFinished &&
      !isAbandoned &&
      !isCensored &&
      voteStatus !== PROPOSAL_VOTING_AUTHORIZED;
    const disableEditButton =
      authorid === userId && voteStatus === PROPOSAL_VOTING_AUTHORIZED;
    const hasBeenUpdated =
      review_status === PROPOSAL_STATUS_UNREVIEWED_CHANGES ||
      parseInt(version, 10) > 1;
    const currentUserIsTheAuthor = authorid === userId;
    const userCanAuthorizeTheVote =
      currentUserIsTheAuthor &&
      voteStatus &&
      (voteStatus === PROPOSAL_VOTING_NOT_AUTHORIZED && !isAbandoned);
    const userCanRevokeVote =
      currentUserIsTheAuthor && voteStatus === PROPOSAL_VOTING_AUTHORIZED;
    const adminCanStartTheVote =
      isAdmin &&
      !isAbandoned &&
      voteStatus === PROPOSAL_VOTING_AUTHORIZED &&
      (authorid !== userid || isTestnet);
    const enableAdminActionsForUnvetted =
      isAdmin && isUnvetted && (authorid !== userid || isTestnet);
    const hasComment = () => {
      return comments.length > 0;
    };
    const isAbandonable =
      isVetted &&
      !isVotingActiveOrFinished &&
      voteStatus !== PROPOSAL_VOTING_AUTHORIZED &&
      isAdmin &&
      !isAbandoned;

    // errors
    const errorSetStatus =
      setStatusProposalToken === id && setStatusProposalError;
    const errorAuthorizeVote = authorizeVoteToken === id && authorizeVoteError;
    const errorStartVote = startVoteToken === id && startVoteError;
    const allErrors = [errorSetStatus, errorAuthorizeVote, errorStartVote];

    // loading flags
    const loadingStartVote = isRequestingStartVote && startVoteToken === id;
    const loadingAuthorizeVote =
      isRequestingAuthorizeVote && authorizeVoteToken === id;

    const status = isApiRequestingSetProposalStatusByToken(id);
    const loadingCensor = status && status === PROPOSAL_STATUS_CENSORED;
    const loadingApprove = status && status === PROPOSAL_STATUS_PUBLIC;
    const loadingAbandoned = status && status === PROPOSAL_STATUS_ABANDONED;

    const censoredorAbandoned = () => {
      if (review_status === PROPOSAL_STATUS_CENSORED) {
        return "spam";
      } else if (isAbandoned) {
        return "abandoned";
      } else {
        return null;
      }
    };

    return (
      <div
        className={`thing thing-proposal id-${id} odd link ${censoredorAbandoned()}`}
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
        !["image", "default", "nsfw", "self"].find(sub => sub === thumbnail) ? (
          <Link className="thumbnail may-blank loggedin" href={url}>
            <img alt="Thumb" height={70} src={thumbnail} width={70} />
          </Link>
        ) : null}
        {is_self ? (
          <Link className="thumbnail self may-blank" href={url} />
        ) : null}
        <div className="entry unvoted">
          <span
            className="title"
            style={{ display: "flex", overflow: "visible" }}
          >
            <Link
              className="title may-blank loggedin"
              href={url}
              tabIndex={rank}
            >
              {title}{" "}
              {review_status === PROPOSAL_STATUS_UNREVIEWED_CHANGES ? (
                <span className="font-12 warning-color">edited</span>
              ) : null}
            </Link>{" "}
            {expanded && (displayVersion || isAbandoned) && version > 1 ? (
              <VersionPicker
                onSelectVersion={selVersion => {
                  openModal(modalTypes.PROPOSAL_VERSION_DIFF, {
                    version: selVersion,
                    token: id
                  });
                }}
                version={version}
              />
            ) : null}
            {domain ? (
              <span className="domain">
                (<Link href={`/domain/${domain}/`}>{domain}</Link>)
              </span>
            ) : null}
            <div
              style={{
                flex: "1",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start"
              }}
            >
              {isEditable ? (
                <Link
                  href={`/proposals/${id}/edit`}
                  className="edit-proposal right-margin-10"
                  onClick={() => null}
                >
                  <i className="fa fa-edit right-margin-5" />
                  Edit
                </Link>
              ) : disableEditButton ? (
                <Tooltip
                  wrapperStyle={{ marginRight: "10px" }}
                  tipStyle={{ top: "20px", fontSize: "14px" }}
                  text="Revoke vote authorization to edit your proposal again."
                  position="bottom"
                >
                  <span style={{ color: "#bbb", cursor: "not-allowed" }}>
                    <i className="fa fa-edit right-margin-5" />
                    Edit
                  </span>
                </Tooltip>
              ) : null}
              {isVetted ? (
                <Tooltip
                  tipStyle={{ top: "20px", fontSize: "14px" }}
                  text="Check this proposal’s content on our GitHub repository. There you can find proposal's metadata and its comments journals."
                  position="bottom"
                >
                  <a
                    style={{ color: "#777" }}
                    href={
                      isTestnet
                        ? `https://github.com/decred-proposals/testnet3/tree/master/${id}/${version}`
                        : `https://github.com/decred-proposals/mainnet/tree/master/${id}/${version}`
                    }
                    target="_blank"
                    className="blue-link"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-github right-margin-5" />
                    See on GitHub
                  </a>
                </Tooltip>
              ) : null}
            </div>
          </span>
          <span
            style={{ display: "flex", flexDirection: "column" }}
            className="tagline"
          >
            <span className="submitted-by">
              {author && (
                <span>
                  {" by "}
                  <Link href={`/user/${authorid}`}>{author}</Link>
                </span>
              )}
            </span>
            {isUnvetted ? (
              <span className="submitted-by">
                {hasBeenUpdated ? "edited " : "submitted "}
                <DateTooltip createdAt={created_utc} />
              </span>
            ) : null}
            <span className="submitted-by">
              {publishedat ? (
                <React.Fragment>
                  {"published "}
                  <DateTooltip createdAt={publishedat} />
                </React.Fragment>
              ) : null}
            </span>
            <span className="submitted-by">
              {abandonedat ? (
                <React.Fragment>
                  {"abandoned "}
                  <DateTooltip createdAt={abandonedat} />
                </React.Fragment>
              ) : null}
            </span>
            <span className="submitted-by">
              {censoredat ? (
                <React.Fragment>
                  {"censored "}
                  <DateTooltip createdAt={censoredat} />
                </React.Fragment>
              ) : null}
            </span>
            <span className="submitted-by">
              {displayVersion ? (
                <React.Fragment>
                  {`version ${version} edited `}
                  <DateTooltip createdAt={created_utc} />
                </React.Fragment>
              ) : null}
            </span>
          </span>
          {draftId && (
            <div className="tagline proposal-draft">
              Saved as draft
              <span
                className="delete-draft"
                onClick={() => {
                  confirmWithModal(modalTypes.CONFIRM_ACTION, {
                    message: "Are you sure you want to delete this draft?"
                  }).then(ok => ok && onDeleteDraftProposal(draftId));
                }}
              >
                <i className="fa fa-trash" />
                Delete
              </span>
            </div>
          )}
          {review_status === 4 && <VoteStats token={id} />}
          {expanded &&
            (lastSubmitted === id ? (
              <Message type="info">
                <span>
                  <p
                    style={{
                      marginTop: "0.4166667em",
                      marginBottom: "0.4166667em"
                    }}
                  >
                    Your proposal has been created, but it will not be public
                    until an admin approves it. You can{" "}
                    <DownloadBundle
                      message="download your proposal"
                      type="proposal"
                    />{" "}
                    and use the{" "}
                    <a
                      href="https://github.com/decred/politeia/tree/master/politeiad/cmd/politeia_verify"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      politeia_verify tool
                    </a>{" "}
                    to prove that your submission has been accepted for review
                    by Politeia. Once approved, an "Authorize Voting to Start"
                    button will appear. You will have 14 days to authorize a
                    proposal vote. If you fail to do so, your proposal will be
                    considered abandoned.
                  </p>
                </span>
              </Message>
            ) : hasComment() ? (
              <div>
                <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                  <DownloadBundle type="proposal" />
                </div>
                <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                  <DownloadBundle type="comments" />
                </div>
              </div>
            ) : (
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <DownloadBundle type="proposal" /> <br />
              </div>
            ))}
          {censorMessage && <CensorMessage message={censorMessage} />}
          <Expando
            {...{
              expanded: this.state.expanded,
              collapseContent: !!commentid,
              is_self,
              selftext,
              selftext_html,
              expandIcon: ToggleIcon("expand", this.hanldeExpandToggle),
              compressIcon: ToggleIcon("compress", this.hanldeExpandToggle)
            }}
          />
          {this.state.expanded && (
            <ProposalImages readOnly files={otherFiles} />
          )}
          {enableAdminActionsForUnvetted ? (
            <ul style={{ display: "flex" }}>
              <li key="spam">
                <ButtonWithLoadingIcon
                  className={`c-btn c-btn-primary${
                    !userCanExecuteActions ? " not-active disabled" : ""
                  }`}
                  onClick={e =>
                    confirmWithModal(modalTypes.CONFIRM_ACTION_WITH_REASON, {
                      reasonPlaceholder:
                        "Please provide a reason to censor this proposal"
                    }).then(
                      ({ reason, confirm }) =>
                        confirm &&
                        onChangeStatus(
                          authorid,
                          loggedInAsEmail,
                          id,
                          PROPOSAL_STATUS_CENSORED,
                          reason
                        )
                    ) && e.preventDefault()
                  }
                  text="Spam"
                  data-event-action="spam"
                  isLoading={loadingCensor}
                />
              </li>
              <li key="approve">
                <ButtonWithLoadingIcon
                  className={`c-btn c-btn-primary${
                    !userCanExecuteActions ? " not-active disabled" : ""
                  }`}
                  onClick={e =>
                    confirmWithModal(modalTypes.CONFIRM_ACTION, {
                      message: "Are you sure you want to publish this proposal?"
                    }).then(
                      confirm =>
                        confirm &&
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
            </ul>
          ) : null}
          {adminCanStartTheVote ? (
            <li key="start-vote">
              <ButtonWithLoadingIcon
                className={`c-btn c-btn-primary${
                  !userCanExecuteActions ? " not-active disabled" : ""
                }`}
                onClick={e =>
                  openModal(
                    modalTypes.START_VOTE_MODAL,
                    {},
                    (d, q, p) =>
                      onStartVote(loggedInAsEmail, id, d, q, p) &&
                      e.preventDefault()
                  )
                }
                text="Start Vote"
                data-event-action="start-vote"
                isLoading={loadingStartVote}
              />
            </li>
          ) : null}
          {userCanAuthorizeTheVote ? (
            <li>
              <ButtonWithLoadingIcon
                className={`c-btn c-btn-primary${
                  !userCanExecuteActions ? " not-active disabled" : ""
                }`}
                onClick={e =>
                  confirmWithModal(modalTypes.CONFIRM_ACTION, {
                    message: (
                      <span>
                        Are you sure you want to <b>authorize</b> the admins to
                        start the voting for this proposal?
                      </span>
                    )
                  }).then(
                    confirm =>
                      confirm && onAuthorizeVote(loggedInAsEmail, id, version)
                  ) && e.preventDefault()
                }
                text="Authorize voting to start"
                data-event-action="authorize-vote"
                isLoading={loadingAuthorizeVote}
              />
            </li>
          ) : userCanRevokeVote ? (
            <li>
              <ButtonWithLoadingIcon
                className={`c-btn c-btn-primary${
                  !userCanExecuteActions ? " not-active disabled" : ""
                }`}
                onClick={e =>
                  confirmWithModal(modalTypes.CONFIRM_ACTION, {
                    message: (
                      <span>
                        Are you sure you want to <b>revoke</b> the start voting
                        authorization for this proposal?
                      </span>
                    )
                  }).then(
                    confirm =>
                      confirm && onRevokeVote(loggedInAsEmail, id, version)
                  ) && e.preventDefault()
                }
                text="Revoke voting authorization"
                data-event-action="revoke-vote"
                isLoading={loadingAuthorizeVote}
              />
            </li>
          ) : null}
          {isAbandonable && (
            <ul style={{ display: "flex" }}>
              <li key="spam">
                <ButtonWithLoadingIcon
                  className={`c-btn c-btn-primary${
                    !userCanExecuteActions ? " not-active disabled" : ""
                  }`}
                  onClick={e =>
                    confirmWithModal(modalTypes.CONFIRM_ACTION_WITH_REASON, {
                      reasonPlaceholder:
                        "Please provide a reason for marking this proposal as abandoned"
                    }).then(
                      ({ reason, confirm }) =>
                        confirm &&
                        onChangeStatus(
                          authorid,
                          loggedInAsEmail,
                          id,
                          PROPOSAL_STATUS_ABANDONED,
                          reason
                        )
                    ) && e.preventDefault()
                  }
                  text="abandon"
                  data-event-action="abandon"
                  isLoading={loadingAbandoned}
                />
              </li>
            </ul>
          )}
          <ul
            className="flat-list buttons"
            style={{
              display: "flex"
            }}
          >
            {isVetted ? (
              <li>
                <Link
                  className="bylink comments may-blank proposal-permalink"
                  data-event-action="comments"
                  href={`${url}?comments=true`}
                >
                  {numcomments || ""}{" "}
                  {numcomments <= 1 ? "comment" : "comments"}
                </Link>
              </li>
            ) : null}
            <li>
              <Link
                className="bylink comments may-blank proposal-permalink"
                data-event-action="permalink"
                href={permalink}
              >
                permalink
              </Link>
            </li>
            {isVotingActiveOrFinished && (
              <li>
                <Link
                  className="bylink comments may-blank proposal-permalink"
                  href=""
                  target="_blank"
                  onClick={e => {
                    e.preventDefault();
                    openModal(
                      modalTypes.SEARCH_PROPOSAL_VOTES,
                      { id: id, title: title },
                      null
                    );
                  }}
                >
                  search votes
                </Link>
              </li>
            )}
          </ul>
          {allErrors.map((error, idx) =>
            error ? (
              <Message
                key={`error-${idx}`}
                type="error"
                header="Error setting proposal status"
                body={error}
              />
            ) : null
          )}
        </div>
        <div className="child" />
        <div className="clearleft" />
      </div>
    );
  }
}

export const ThingLink = actions(ThingLinkComp);

export default withRouter(thingLinkConnector(ThingLink));
