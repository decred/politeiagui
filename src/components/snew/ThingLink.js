import React from "react";
import ProposalImages from "../ProposalImages";

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
  is_self,
  selftext,
  selftext_html,
  thumbnail,
  banned_by,
  otherFiles
}) => (
  <div
    className={`thing id-${id} odd link ${banned_by ? "spam" : null}`}
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

      {/*<ul className="flat-list buttons">
        <li className="first">
          <Link
            className="bylink comments may-blank"
            data-event-action="comments"
            href={permalink}
            rel="nofollow"
          >{num_comments} comments</Link>
        </li>
        <li className="share">
          <a className="post-sharing-button">share</a>
        </li>
        <li className="link-save-button save-button">
          <a>save</a>
        </li>
        <li>
          <form className="state-button hide-button" >
            <input name="executed" type="hidden" defaultValue="hidden" />
            <span>
              <a data-event-action="hide" >hide</a>
            </span>
          </form>
        </li>
        <li className="report-button">
          <a className="action-thing reportbtn access-required" data-event-action="report" >
            report
          </a>
        </li>
      </ul>
      <div className="reportform" />
      */}
    </div>
    <div className="child" />
    <div className="clearleft" />
  </div>
);

export default ThingLink;

