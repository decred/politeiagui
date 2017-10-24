import React from "react";
import ProposalImages from "../ProposalImages";
import actions from "../../connectors/login";
import { PROPOSAL_STATUS_CENSORED, PROPOSAL_STATUS_PUBLIC, PROPOSAL_STATUS_UNREVIEWED } from "../../constants";

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
  onChangeStatus
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
        submitted {created_utc}
      </p>
      <Expando {...{ expanded, is_self, selftext, selftext_html }} />

      <ProposalImages readOnly files={otherFiles} />

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
              <form className="toggle remove-button">
                <a
                  className="togglebutton access-required"
                  data-event-action="spam"
                  onClick={() => onChangeStatus(id, PROPOSAL_STATUS_CENSORED)}
                >spam</a>
              </form>
            </li>,
            <li key="approve">
              <form className="toggle approve-button">
                <a
                  className="togglebutton access-required"
                  data-event-action="approve"
                  onClick={() => onChangeStatus(id, PROPOSAL_STATUS_PUBLIC)}
                >approve</a>
              </form>
            </li>
          ] : null
        ) : null}
      </ul>
    </div>
    <div className="child" />
    <div className="clearleft" />
  </div>
);

export default actions(ThingLink);

