import React from "react";
import PropTypes from "prop-types";
import styles from "./RecordWrapper.module.css";
import DateTooltip from "../DateTooltip";
import DownloadJSON from "../DownloadJSON";
import {
  Card,
  H2,
  Icon,
  Link as UILink,
  Text,
  classNames,
  useHover,
  useTheme,
  getThemeProperty,
  Tooltip
} from "pi-ui";
import { Row } from "../layout";
import Link from "../Link";
import { useConfig } from "src/containers/Config";
import { useLoader } from "src/containers/Loader";
import Join from "../Join";
import CopyLink from "../CopyLink";
import rfpTag from "src/assets/images/rfp-tag.svg";

export const Author = ({ username, url }) => <Link to={url}>{username}</Link>;

export const Event = ({ event, timestamp, className, size }) => (
  <DateTooltip timestamp={timestamp} placement="bottom">
    {({ timeAgo }) => (
      <Text
        id={`event-${event}-${timestamp}`}
        className={classNames(styles.eventTooltip, className)}
        truncate
        size={size}>{`${event} ${timeAgo}`}</Text>
    )}
  </DateTooltip>
);

export const RecordToken = ({ token }) => (
  <div className="align-center overflow-hidden">
    <Icon type="sign" className="margin-right-xs" />
    <Text id={`proposal-token-${token}`} truncate>
      {token}
    </Text>
  </div>
);

export const Title = ({ children, isAbandoned, url, ...props }) => {
  const SimpleWrapper = (props) => <div {...props} />;
  const Wrapper = url ? Link : SimpleWrapper;
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";
  const titleClass = isAbandoned
    ? isDarkTheme
      ? styles.darkAbandonedTitle
      : styles.abandonedTitle
    : styles.title;
  return (
    <Wrapper to={url} className={titleClass}>
      <H2 {...props}>{children}</H2>
    </Wrapper>
  );
};

export const Subtitle = ({ children }) => (
  <Join
    className={classNames("margin-top-s", styles.subtitleWrapper)}
    SeparatorComponent={() => (
      <span className="text-secondary-color margin-left-s margin-right-s">
        •
      </span>
    )}>
    {children}
  </Join>
);

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
    )}>
    {children}
  </div>
);

const MobileHeader = ({ title, status, edit, isRfp }) => (
  <div className={styles.titleWrapper}>
    <div className={styles.titleEditWrapper}>
      {isRfp && <RfpTag className={styles.mobileRfpTag} />}
      {title}
    </div>
    <div className={styles.titleStatusWrapper}>
      {status}
      {edit}
    </div>
  </div>
);

const RfpTag = React.memo(({ className }) => (
  <img
    alt="rfp"
    className={classNames("margin-right-s", "margin-top-xs", className)}
    src={rfpTag}
  />
));

export const Header = React.memo(function Header({
  title,
  subtitle,
  status,
  edit,
  mobile,
  disableMobileView = false,
  isRfp,
  isRfpSubmission,
  rfpProposalLink
}) {
  return (
    <div className={styles.header}>
      {!mobile || disableMobileView ? (
        <div className={styles.titleWrapper}>
          <div className={styles.titleEditWrapper}>
            {isRfp && <RfpTag />}
            {title}
            {edit}
          </div>
          <div className={styles.titleStatusWrapper}>{status}</div>
        </div>
      ) : (
        <MobileHeader title={title} isRfp={isRfp} status={status} edit={edit} />
      )}
      {isRfpSubmission && rfpProposalLink}
      {subtitle}
    </div>
  );
});

export const ChartsLink = ({ token }) => {
  const { apiInfo } = useLoader();
  const { theme } = useTheme();
  const hoverColor = getThemeProperty(theme, "icon-hover-color");
  const [ref, isHovered] = useHover();
  const iconColor = isHovered ? hoverColor : undefined;
  const hostName = apiInfo.testnet
    ? "testnet.decred.org"
    : "dcrdata.decred.org";

  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

  return (
    <Tooltip
      className={classNames(
        styles.seeOnGithubTooltip,
        isDarkTheme && styles.darkSeeOnGithubTooltip
      )}
      placement="bottom"
      content="Voting Charts">
      <UILink
        ref={ref}
        target="_blank"
        rel="nofollow noopener noreferrer"
        href={`https://${hostName}/proposal/${token}`}>
        <Icon type="chart" iconColor={iconColor} />
      </UILink>
    </Tooltip>
  );
};

export const GithubLink = ({ token }) => {
  const { testnetGitRepository, mainnetGitRepository } = useConfig();
  const { apiInfo } = useLoader();
  const repoURL = apiInfo.testnet ? testnetGitRepository : mainnetGitRepository;
  const { theme } = useTheme();
  const hoverColor = getThemeProperty(theme, "icon-hover-color");
  const [ref, isHovered] = useHover();
  const iconColor = isHovered ? hoverColor : undefined;

  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

  return (
    <Tooltip
      className={classNames(
        styles.seeOnGithubTooltip,
        isDarkTheme && styles.darkSeeOnGithubTooltip
      )}
      placement="bottom"
      content="See on GitHub">
      <UILink
        ref={ref}
        rel="nofollow noopener noreferrer"
        target="_blank"
        href={`${repoURL}/${token}`}>
        <Icon type="github" iconColor={iconColor} />
      </UILink>
    </Tooltip>
  );
};

export const CommentsLink = ({
  numOfComments,
  url,
  showIcon = true,
  className
}) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";
  return (
    <Link
      to={url}
      gray={!isDarkTheme}
      dark={isDarkTheme}
      className={classNames(styles.commentsLink, className)}>
      {showIcon && <Icon type="discuss" className="margin-right-s" />}
      <span
        className={classNames(
          styles.commentsNumber,
          isDarkTheme && styles.darkCommentsNumber
        )}>
        {numOfComments}
      </span>
      Comments
    </Link>
  );
};

export const RfpProposalLink = ({ url, rfpTitle }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";
  return (
    <div className={styles.rfpLink}>
      <span
        className={classNames(
          !isDarkTheme && styles.proposedFor,
          isDarkTheme && styles.darkProposedFor
        )}>
        Proposed for{" "}
      </span>
      <Link to={url}>{rfpTitle}</Link>
    </div>
  );
};

export const DownloadRecord = DownloadJSON;

const RecordWrapper = ({ children, className }) => (
  <Card className={classNames("container margin-bottom-m", className)}>
    {children({
      Author,
      Event,
      Row,
      Title,
      RfpProposalLink,
      CommentsLink,
      Link,
      GithubLink,
      ChartsLink,
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

RecordWrapper.propTypes = {
  children: PropTypes.func.isRequired,
  className: PropTypes.string
};

Author.propTypes = {
  username: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
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
