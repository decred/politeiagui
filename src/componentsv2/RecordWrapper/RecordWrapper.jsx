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
import CopyLink from "../CopyLink";

export const Author = ({ username, id }) => (
  <Link to={`/user/${id}`}>{username}</Link>
);

export const Event = ({ event, timestamp, keepOnMobile = false }) => (
  <DateTooltip
    className={!keepOnMobile ? "hide-on-mobile" : ""}
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

export const RecordToken = ({ token }) => {
  return (
    <div className="align-center overflow-hidden">
      <Icon type="sign" className="margin-right-xs" />
      <Text id={`proposal-token-${token}`} truncate>
        {token}
      </Text>
    </div>
  );
};

export const Title = ({ children, url, ...props }) => {
  const SimpleWrapper = props => <div {...props} />;
  const Wrapper = url ? Link : SimpleWrapper;
  return (
    <Wrapper to={url} className={styles.title}>
      <H2 {...props}>{children}</H2>
    </Wrapper>
  );
};

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

export const Edit = ({ url }) => (
  <Link to={url}>
    <Icon type="edit" className={styles.editButton} />
  </Link>
);

export const Status = ({ children, disableMobileView, className }) => (
  <div
    className={classNames(
      styles.status,
      disableMobileView && styles.disableMobileView,
      className
    )}
  >
    {children}
  </div>
);

const MobileHeader = ({ title, status, edit }) => (
  <div className={styles.titleWrapper}>
    <div className={styles.titleEditWrapper}>{title}</div>
    <div className={styles.titleStatusWrapper}>
      {status}
      {edit}
    </div>
  </div>
);

export const Header = ({
  title,
  subtitle,
  status,
  edit,
  mobile,
  disableMobileView = false
}) => {
  return (
    <div className={styles.header}>
      {!mobile || disableMobileView ? (
        <div className={styles.titleWrapper}>
          <div className={styles.titleEditWrapper}>
            {title}
            {edit}
          </div>
          <div className={styles.titleStatusWrapper}>{status}</div>
        </div>
      ) : (
        <MobileHeader title={title} status={status} edit={edit} />
      )}
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

export const CommentsLink = ({ numOfComments, url }) => (
  <Link to={url} gray className={styles.commentsLink}>
    <Icon type="discuss" className="margin-right-s" />
    <span>{numOfComments}</span>
    Comments
  </Link>
);

export const DownloadRecord = DownloadJSON;

const RecordWrapper = ({ children, className }) => {
  return (
    <Card className={classNames("container margin-bottom-m", className)}>
      {children({
        Author,
        Event,
        Row,
        Title,
        CommentsLink,
        Link,
        GithubLink,
        CopyLink,
        DownloadRecord,
        Header,
        Subtitle,
        Edit,
        Status,
        RecordToken
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
