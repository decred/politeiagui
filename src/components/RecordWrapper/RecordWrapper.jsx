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
  Tooltip,
  CopyableText,
  useMediaQuery,
  DEFAULT_DARK_THEME_NAME,
  Dropdown,
  DropdownItem
} from "pi-ui";
import { Row } from "../layout";
import Link from "../Link";
import { useLoader } from "src/containers/Loader";
import Join from "../Join";
import CopyLink from "../CopyLink";
import rfpTag from "src/assets/images/rfp-tag.svg";
import useTimestamps from "src/hooks/api/useTimestamps";
import { formatUnixTimestampToObj } from "src/utils";

// TODO: remove legacy
export const Author = ({ username, url, isLegacy }) =>
  isLegacy ? <span>{username}</span> : <Link to={url}>{username}</Link>;

export const Event = ({ event, timestamp, className, size }) => (
  <DateTooltip timestamp={timestamp} placement="bottom">
    {({ timeAgo }) => (
      <Text
        id={`event-${event}-${timestamp}`}
        className={classNames(styles.eventTooltip, className)}
        truncate
        size={size}>
        {`${event} ${timeAgo}`}
      </Text>
    )}
  </DateTooltip>
);

export const RecordToken = ({ token, isCopyable }) => {
  const shouldPlaceTooltipLeft = useMediaQuery("(max-width: 560px)");
  return (
    <div className={styles.recordToken}>
      {isCopyable && (
        <CopyableText
          id={`proposal-token-${token}`}
          data-testid="record-token"
          truncate
          tooltipPlacement={shouldPlaceTooltipLeft ? "left" : "bottom"}>
          {token}
        </CopyableText>
      )}
      {!isCopyable && (
        <>
          <Icon type="sign" className="margin-right-xs" />
          <Text id={`proposal-token-${token}`} truncate>
            {token}
          </Text>
        </>
      )}
    </div>
  );
};

// TODO: remove legacy
export const Title = ({ children, url, isLegacy, ...props }) => {
  const SimpleWrapper = (props) => <div {...props} />;
  const Wrapper = url ? Link : SimpleWrapper;
  return !isLegacy ? (
    <Wrapper to={url} className={styles.title}>
      <H2 {...props} data-testid="record-title">
        {children}
      </H2>
    </Wrapper>
  ) : (
    <>
      <Tooltip
        content="This proposal is an archived proposal. Clicking on it will take you to the proposals-archive website."
        placement="right">
        <Icon type="info" />
      </Tooltip>
      <a href={url} className={classNames(styles.title, "margin-left-s")}>
        <H2 {...props} data-testid="record-title-legacy">
          {children}
        </H2>
      </a>
    </>
  );
};

export const Subtitle = ({ children, separatorSymbol = "•" }) => (
  <Join
    className={classNames("margin-top-s", styles.subtitleWrapper)}
    SeparatorComponent={() => (
      <span className="text-secondary-color margin-left-s margin-right-s">
        {separatorSymbol}
      </span>
    )}>
    {children}
  </Join>
);

export const JoinTitle = ({ children, className, separatorSymbol = "•" }) => (
  <Join
    className={classNames(className, styles.subtitleWrapper)}
    SeparatorComponent={() => (
      <span className="text-secondary-color margin-left-s margin-right-s">
        {separatorSymbol}
      </span>
    )}>
    {children}
  </Join>
);

export const Edit = ({ url, tabIndex }) => (
  <Link to={url || ""} tabIndex={tabIndex} data-testid="record-edit-button">
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
    className={classNames("margin-right-s", styles.rfptag, className)}
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
    <div className={styles.header} data-testid="record-header">
      {!mobile || disableMobileView ? (
        <div className={styles.titleWrapper}>
          <div
            className={classNames(
              styles.titleEditWrapper,
              isRfp && styles.rfpTitleWrapper
            )}>
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
  const { theme, themeName } = useTheme();
  const bgColor = getThemeProperty(theme, "icon-color");
  const color = getThemeProperty(theme, "icon-background-color");
  const hoverColor = getThemeProperty(theme, "icon-hover-color");
  const [ref, isHovered] = useHover();
  const iconColor = isHovered ? hoverColor : color;
  const hostName = apiInfo.testnet
    ? "testnet.decred.org"
    : "dcrdata.decred.org";
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;

  return (
    <Tooltip
      className={classNames(
        styles.actionsTooltip,
        isDarkTheme && styles.darkActionsTooltip
      )}
      placement="bottom"
      content="Voting Charts">
      <UILink
        ref={ref}
        target="_blank"
        rel="nofollow noopener noreferrer"
        href={`https://${hostName}/proposal/${token}`}>
        <Icon type="chart" iconColor={iconColor} backgroundColor={bgColor} />
      </UILink>
    </Tooltip>
  );
};

export const MarkdownLink = ({ to, active = false, onClick }) => {
  const { theme, themeName } = useTheme();
  const color = getThemeProperty(theme, "icon-color");
  const hoverColor = getThemeProperty(theme, "icon-hover-color");
  const darkIconColor = getThemeProperty(theme, "text-color");
  const [ref, isHovered] = useHover();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const iconColor = isHovered
    ? hoverColor
    : isDarkTheme
    ? darkIconColor
    : color;
  return (
    <Tooltip
      className={classNames(
        styles.actionsTooltip,
        isDarkTheme && styles.darkActionsTooltip
      )}
      placement="bottom"
      content={active ? "See rendered markdown" : "See raw markdown"}>
      <UILink
        target="_blank"
        rel="nofollow noopener noreferrer"
        href={to}
        onClick={onClick}>
        <Icon
          ref={ref}
          type="markdown"
          viewBox="0 0 208 128"
          iconColor={iconColor}
        />
      </UILink>
    </Tooltip>
  );
};

// TODO: remove legacy
export const CommentsLink = ({
  numOfComments,
  url,
  isLegacy,
  showIcon = true,
  className
}) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  return (
    <Link
      to={url}
      isLegacy={isLegacy}
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

export const RfpProposalLink = ({ url, rfpTitle, isLegacy }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  return (
    <div className={styles.rfpLink}>
      <span
        className={classNames(
          !isDarkTheme && styles.proposedFor,
          isDarkTheme && styles.darkProposedFor
        )}>
        Proposed for{" "}
      </span>
      {isLegacy ? (
        <a href={url}>{rfpTitle}</a>
      ) : (
        <Link to={url}>{rfpTitle}</Link>
      )}
    </div>
  );
};

export const DownloadRecord = ({
  content,
  fileName,
  label,
  serverpublickey
}) => {
  const bundle = {
    record: {
      state: content.state,
      status: content.status,
      version: content.version,
      timestamp: content.timestamp,
      username: content.username,
      metadata: content.metadata,
      files: content.files,
      censorshiprecord: content.censorshiprecord
    },
    serverpublickey
  };
  return <DownloadJSON fileName={fileName} label={label} content={bundle} />;
};

export const DownloadTimestamps = ({ token, version, label }) => {
  const { onFetchRecordTimestamps } = useTimestamps();
  return (
    <DownloadJSON
      label={label}
      fileName={`${token}-v${version}-timestamps`}
      isAsync={true}
      content={[]}
      beforeDownload={() => onFetchRecordTimestamps(token, version)}
    />
  );
};

export const DownloadVotes = ({ label, fileName, serverpublickey, token }) => {
  const { onFetchVotesBundle } = useTimestamps();
  return (
    <DownloadJSON
      label={label}
      fileName={fileName}
      isAsync={true}
      content={[]}
      beforeDownload={() => onFetchVotesBundle(token, serverpublickey)}
    />
  );
};

export const LinkSection = ({ children, className, title }) => (
  <Dropdown
    className={className}
    title={title}
    closeOnItemClick={false}
    data-testid="record-links">
    {React.Children.toArray(children).map((link, i) => (
      <DropdownItem key={i}>{link}</DropdownItem>
    ))}
  </Dropdown>
);

const MetadataLabel = ({ label }) => (
  <div className={styles.metadataLabel}>{label}:</div>
);

const MetadataValue = ({ value }) => (
  <div className="margin-left-s">{value}</div>
);

export const Metadata = ({ amount, domain, startDate, endDate, isRFP }) => {
  const {
    day: startDay,
    month: startMonth,
    year: startYear
  } = (startDate && formatUnixTimestampToObj(startDate)) || {};
  const {
    day: endDay,
    month: endMonth,
    year: endYear
  } = (endDate && formatUnixTimestampToObj(endDate)) || {};

  const metadataAvailable = !!amount || !!domain || !!startDate || !!endDate;

  return (
    metadataAvailable && (
      <div className="flex-column" data-testid="record-metadata">
        <Row>
          <MetadataLabel label="Domain" />
          <MetadataValue value={domain} />
        </Row>
        {!isRFP && (
          <>
            <Row>
              <MetadataLabel label="Amount" />
              <MetadataValue value={amount} />
            </Row>
            <Row>
              <MetadataLabel label="Start Date" />
              <MetadataValue value={`${startMonth}/${startDay}/${startYear}`} />
            </Row>
            <Row>
              <MetadataLabel label="End Date" />
              <MetadataValue value={`${endMonth}/${endDay}/${endYear}`} />
            </Row>
          </>
        )}
      </div>
    )
  );
};

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
      ChartsLink,
      MarkdownLink,
      CopyLink,
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

RecordToken.propTypes = {
  token: PropTypes.string.isRequired,
  isCopyable: PropTypes.bool
};
RecordToken.defaultProps = {
  isCopyable: false
};

export default RecordWrapper;
