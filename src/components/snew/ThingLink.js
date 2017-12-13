import React from "react";
import TimeAgo from "timeago-react";
import ProposalImages from "../ProposalImages";
import Message from "../Message";
import actions from "../../connectors/actions";
import { PROPOSAL_STATUS_CENSORED, PROPOSAL_STATUS_PUBLIC, PROPOSAL_STATUS_UNREVIEWED } from "../../constants";
import { getProposalStatus } from "../../helpers";

const ThingLink = ({
  Link,
  Expando,
  id,
  expanded = false,
  name,
  author,
  domain,
  rank=0,
  //score,
  //downs,
  //ups,
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
  isAdmin,
  onChangeStatus,
  setStatusProposalToken,
  setStatusProposalError
}) => (
  <div
    className={`thing id-${id} odd link ${(review_status === PROPOSAL_STATUS_CENSORED) ? "spam" : null}`}
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
    {/*
    <span className="rank">{rank}</span>
    <div className="midcol unvoted">
      <div
        aria-label="upvote"
        className="arrow up login-required access-required"
        data-event-action="upvote"
        role="button"
        tabIndex={0}
      />
      <div className="score dislikes">{downs > 10000 ? (downs/1000.0).toFixed(1)+"k" : downs}</div>
      <div className="score unvoted">{score  > 10000 ? (score/1000.0).toFixed(1)+"k" : score}</div>
      <div className="score likes">{ups > 10000 ? (ups/1000.0).toFixed(1)+"k" : ups}</div>
      <div
        aria-label="downvote"
        className="arrow down login-required access-required"
        data-event-action="downvote"
        role="button"
        tabIndex={0}
      />
    </div>
    */}
    {(thumbnail && !["image", "default", "nsfw", "self"].find((sub => sub === thumbnail))) ? (
      <Link
        className="thumbnail may-blank loggedin"
        href={url}
      >
        <img
          alt="Thumb"
          height={70}
          src={thumbnail}
          width={70}
        />
      </Link>
    ) : null}
    {is_self ? <Link className="thumbnail self may-blank" href={url}/> : null}
    <div className="entry unvoted">
      <p className="title">
        <Link
          className="title may-blank loggedin"
          href={url}
          tabIndex={rank}
        >{title}</Link>{" "}
        {domain ? <span className="domain">
          (<Link href={`/domain/${domain}/`}>{domain}</Link>)
        </span> : null}
      </p>
      {/*<div
        title="toggle"
        className={`expando-button ${expanded ? "expanded" : "collapsed"} selftext`}
      />*/}
      <p className="tagline">
        <Link href={permalink}>submitted <TimeAgo datetime={created_utc*1000} /></Link>
      </p>
      <p className="tagline">
        {id} • {getProposalStatus(review_status)}
      </p>
      <Expando {...{ expanded, is_self, selftext, selftext_html }} />

      <ProposalImages readOnly files={otherFiles} />

      {review_status === PROPOSAL_STATUS_UNREVIEWED && isAdmin ? (
        <ul className="flat-list buttons">
          <li className="first">
            <Link
              className="bylink comments may-blank"
              data-event-action="comments"
              href={permalink}
            >permalink</Link>
          </li>
          {isAdmin ? (
            (review_status === PROPOSAL_STATUS_UNREVIEWED) ? [
              <li key="spam">
                <form className="toggle remove-button" onSubmit={(e) =>
                  onChangeStatus(id, PROPOSAL_STATUS_CENSORED) && e.preventDefault()}>
                  <button
                    className="togglebutton access-required"
                    data-event-action="spam"
                    type="submit"
                  >spam</button>
                </form>
              </li>,
              <li key="approve">
                <form className="toggle approve-button" onSubmit={(e) =>
                  onChangeStatus(id, PROPOSAL_STATUS_PUBLIC) && e.preventDefault()}>
                  <button
                    className="togglebutton access-required"
                    data-event-action="approve"
                    type="submit"
                  >approve</button>
                </form>
              </li>
            ] : null
          ) : null}
        </ul>
      ) : null}

      {(setStatusProposalError && setStatusProposalToken === id) ? (
        <Message
          key="error"
          type="error"
          header="Error setting proposal status"
          body={setStatusProposalError} />
      ) : null}
    </div>
    <div className="child" />
    <div className="clearleft" />
  </div>
);

export default actions(ThingLink);

