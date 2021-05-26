import {
  classNames,
  Container,
  H1,
  Main as UIMain,
  Message,
  PageDetails as PageDetailsUI,
  Tab as TabUI,
  Tabs as TabsUI,
  TopBanner
} from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import ErrorBoundary from "src/components/ErrorBoundary";
import NewButton from "src/components/NewButton";
import Header from "src/containers/Header/Header";
import useScrollToTop from "src/hooks/utils/useScrollToTop";
import Sidebar from "../../Sidebar";
import styles from "../layouts.module.css";
import { useConfig } from "src/containers/Config";
import usePaywall from "src/hooks/api/usePaywall";
import isNull from "lodash/fp/isNull";

const renderError = (error) => (
  <Main className={styles.singleContentMain}>
    <Message kind="error">{error.toString()}</Message>
  </Main>
);

const DefaultNewButton = () => {
  const {
    recordType,
    constants: { RECORD_TYPE_PROPOSAL, RECORD_TYPE_INVOICE, RECORD_TYPE_DCC }
  } = useConfig();
  const { isPaid } = usePaywall();
  const mapRecordTypeToButton = {
    [RECORD_TYPE_PROPOSAL]: (
      // When paywall is off `isPaid` is null, in that case the new proposal
      // button should be enabled.
      <NewButton
        disabled={!isNull(isPaid) && !isPaid}
        label="New Proposal"
        goTo="/record/new"
      />
    ),
    [RECORD_TYPE_INVOICE]: (
      <NewButton label="New Invoice" goTo="/invoices/new" />
    ),
    [RECORD_TYPE_DCC]: <NewButton label="New DCC" goTo="/dccs/new" />
  };
  return mapRecordTypeToButton[recordType] || null;
};

const Title = (props) => <H1 {...props} />;

const Subtitle = (props) => (
  <span className={styles.subtitle} {...props}>
    {props.children}
  </span>
);

const PageDetails = ({
  className,
  title,
  subtitle,
  actionsContent,
  actionsClassName,
  children,
  headerClassName,
  titleAndSubtitleWrapperClassName,
  ...props
}) => {
  const titleContent =
    typeof title === "string" ? (
      <H1
        id="page-title"
        truncate
        linesBeforeTruncate={2}
        className={styles.pageDetailsTitle}>
        {title}
      </H1>
    ) : (
      title
    );
  return (
    <PageDetailsUI
      className={classNames(styles.customPageDetails, className)}
      {...props}>
      <div className={classNames(styles.pageDetailsHeader, headerClassName)}>
        <div
          className={classNames(
            styles.titleAndSubtitleWrapper,
            titleAndSubtitleWrapperClassName
          )}>
          {titleContent}
          {!!subtitle && <Subtitle>{subtitle}</Subtitle>}
        </div>
        <div
          className={classNames(styles.pageDetailsActions, actionsClassName)}>
          {actionsContent}
        </div>
      </div>

      {children}
    </PageDetailsUI>
  );
};

const Tab = ({ className, ...props }) => (
  <TabUI className={classNames(styles.customTab, className)} {...props} />
);

const Tabs = ({ className, ...props }) => (
  <TabsUI className={classNames(className)} {...props} />
);

const Main = ({ className, fillScreen, ...props }) => (
  <UIMain
    className={classNames(
      styles.customMain,
      fillScreen && styles.customMainNoSidebar,
      className
    )}
    {...props}
  />
);

const MultipleContentpage = ({ children, disableScrollToTop, ...props }) => {
  useScrollToTop(disableScrollToTop);
  return (
    <Container {...props}>
      <Header noBorder />
      <ErrorBoundary errorRenderer={renderError}>
        {children({
          Sidebar,
          TopBanner,
          Main,
          Subtitle,
          PageDetails,
          DefaultNewButton,
          Title,
          Tabs,
          Tab
        })}
      </ErrorBoundary>
    </Container>
  );
};

PageDetails.defaultProps = {
  actionsContent: <DefaultNewButton />
};

MultipleContentpage.propTypes = {
  children: PropTypes.func,
  disableScrollToTop: PropTypes.bool
};

MultipleContentpage.defaultProps = {
  disableScrollToTop: false
};

export default MultipleContentpage;
