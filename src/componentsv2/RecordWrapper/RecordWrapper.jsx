import React from "react";
import PropTypes from "prop-types";
import styles from "./RecordWrapper.module.css";
import DateTooltip from "../DateTooltip";
import DownloadJSON from "../DownloadJSON";
import { Card, H2, Icon, Link as UILink, Text, classNames } from "pi-ui";
import { Row } from "../layout";
import Link from "../Link";
import githubIcon from "src/assets/github.svg";
import { useConfig } from "src/Config";
import { useLoader } from "src/Appv2/Loader";
import Join from "../Join";

export const Author = ({ username, id }) => (
  <Link to={`/user/${id}`}>{username}</Link>
);

export const Event = ({ event, timestamp }) => (
  <DateTooltip
    className="hide-on-mobile"
    timestamp={timestamp}
    placement="bottom"
  >
    {({ timeAgo }) => (
      <Text
        id={`event-${event}-${timestamp}`}
        color="gray"
        truncate
      >{`${event} ${timeAgo}`}</Text>
    )}
  </DateTooltip>
);

export const Title = ({ children, url, ...props }) => (
  <Link to={url} className={styles.title}>
    <H2 {...props}>{children}</H2>
  </Link>
);

export const Subtitle = ({ children }) => {
  return (
    <Join
      className="margin-top-s"
      SeparatorComponent={() => (
        <span className="margin-left-s margin-right-s hide-on-mobile color-gray">
          •
        </span>
      )}
    >
      {children}
    </Join>
  );
};

export const Status = ({ children }) => (
  <div className={styles.status}>{children}</div>
);

export const Header = ({ title, subtitle, status, edit }) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleWrapper}>
        {title}
        {edit}
        {status}
      </div>
      {subtitle}
    </div>
  );
};

export const GithubLink = ({ token }) => {
  const { testnetGitRepository, mainnetGitRepository } = useConfig();
  const { apiInfo } = useLoader();
  const repoURL = apiInfo.testnet ? testnetGitRepository : mainnetGitRepository;
  return (
    <UILink target="_blank" href={`${repoURL}/${token}`}>
      <img alt="github icon" src={githubIcon} />
    </UILink>
  );
};

export const CommentsLink = ({ numOfComments, url = "#" }) => (
  <Link to={url} gray className={styles.commentsLink}>
    <Icon type="discuss" className="margin-right-s" />
    <span>{numOfComments}</span>
    Comments
  </Link>
);

export const DownloadRecord = DownloadJSON;

const RecordWrapper = ({ children, className }) => {
  return (
    <Card
      className={classNames(styles.recordCard, "margin-bottom-m", className)}
    >
      {children({
        Author,
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
      })}
    </Card>
  );
};

RecordWrapper.propTypes = {
  children: PropTypes.func.isRequired,
  className: PropTypes.string
};

Author.propTypes = {
  username: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

Event.propTypes = {
  event: PropTypes.string,
  timestamp: PropTypes.number,
  show: PropTypes.bool
};

Event.defaultProps = {
  show: true
};

export default RecordWrapper;
