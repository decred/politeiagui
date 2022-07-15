import React from "react";
import PropTypes from "prop-types";
import styles from "./RecordWrapper.module.css";
import DateTooltip from "../DateTooltip";
import DownloadJSON from "../DownloadJSON";
import {
  Card,
  H2,
  Link as UILink,
  Icon,
  Text,
  classNames,
  useTheme,
  Tooltip,
  CopyableText,
  useMediaQuery,
  DEFAULT_DARK_THEME_NAME,
  Dropdown,
  ButtonIcon,
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
import { formatDateToInternationalString } from "src/helpers";

export const Author = ({ username, url }) => <Link to={url}>{username}</Link>;

export const Event = ({ event, timestamp, className, size, additionInfo }) => (
  <DateTooltip
    timestamp={timestamp}
    placement="bottom"
    additionInfo={additionInfo}
  >
    {({ timeAgo }) => (
      <Text
        id={`event-${event}-${timestamp}`}
        className={classNames(styles.eventTooltip, className)}
        truncate
        size={size}
      >
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
          tooltipPlacement={shouldPlaceTooltipLeft ? "left" : "bottom"}
        >
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

export const Title = ({ children, url, ...props }) => {
  const SimpleWrapper = (props) => <div {...props} />;
  const Wrapper = url ? Link : SimpleWrapper;
  return (
    <Wrapper
      to={url}
      className={classNames(styles.baseTitle, url && styles.underlineTitle)}
    >
      <H2 {...props} data-testid="record-title">
        {children}
      </H2>
    </Wrapper>
  );
};

export const Subtitle = ({ children, separatorSymbol = "•" }) => (
  <Join
    className={classNames("margin-top-s", styles.subtitleWrapper)}
    SeparatorComponent={() => (
      <span className={styles.subtitleSeparator}>{separatorSymbol}</span>
    )}
  >
    {children}
  </Join>
);

export const JoinTitle = ({ children, className, separatorSymbol = "•" }) => (
  <Join
    className={classNames(className, styles.flexWrap)}
    SeparatorComponent={() => (
      <span className={styles.subtitleSeparator}>{separatorSymbol}</span>
    )}
  >
    {children}
  </Join>
);

export const Edit = ({ url, tabIndex, disabled }) => (
  <Link
    to={url || ""}
    tabIndex={tabIndex}
    data-testid="record-edit-button"
    className={styles.editButton}
  >
    <ButtonIcon type="edit" disabled={disabled} />
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

export const RfpTag = React.memo(({ className }) => (
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
            )}
          >
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

export const ChartsLink = ({ token, legacytoken }) => {
  console.log(legacytoken);
  const { apiInfo } = useLoader();
  const { themeName } = useTheme();
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
      content="Voting Charts"
    >
      <UILink
        target="_blank"
        rel="nofollow noopener noreferrer"
        href={`https://${hostName}/proposal/${legacytoken || token}`}>
        <ButtonIcon type="chart" />
      </UILink>
    </Tooltip>
  );
};

export const MarkdownLink = ({ to, active = false, onClick }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  return (
    <Tooltip
      className={classNames(
        styles.actionsTooltip,
        isDarkTheme && styles.darkActionsTooltip
      )}
      placement="bottom"
      content={active ? "See rendered markdown" : "See raw markdown"}
    >
      <UILink
        target="_blank"
        rel="nofollow noopener noreferrer"
        href={to}
        onClick={onClick}
      >
        <ButtonIcon type="markdown" viewBox="0 0 208 128" />
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
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  return (
    <Link
      to={url}
      gray={!isDarkTheme}
      dark={isDarkTheme}
      className={classNames(styles.commentsLink, className)}
    >
      {showIcon && <Icon type="discuss" className="margin-right-s" />}
      <span
        className={classNames(
          styles.commentsNumber,
          isDarkTheme && styles.darkCommentsNumber
        )}
      >
        {numOfComments}
      </span>
      Comments
    </Link>
  );
};

export const RfpProposalLink = ({ url, rfpTitle }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  return (
    <div className={styles.rfpLink}>
      <span
        className={classNames(
          !isDarkTheme && styles.proposedFor,
          isDarkTheme && styles.darkProposedFor
        )}
      >
        Proposed for{" "}
      </span>
      <Link to={url}>{rfpTitle}</Link>
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
    data-testid="record-links"
  >
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
  const startDateView = formatDateToInternationalString(
    (startDate && formatUnixTimestampToObj(startDate)) || {}
  );
  const endDateView = formatDateToInternationalString(
    (endDate && formatUnixTimestampToObj(endDate)) || {}
  );

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
              <MetadataValue value={startDateView} />
            </Row>
            <Row>
              <MetadataLabel label="End Date" />
              <MetadataValue value={endDateView} />
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
