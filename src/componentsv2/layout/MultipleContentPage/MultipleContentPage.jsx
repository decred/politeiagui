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
import NewProposalButton from "src/componentsv2/NewProposalButton";
import Header from "src/containers/Header/Header";
import useScrollToTop from "src/hooks/utils/useScrollToTop";
import Sidebar from "../../Sidebar";
import styles from "../layouts.module.css";

const renderError = error => (
  <Main className={styles.singleContentMain}>
    <Message kind="error">{error.toString()}</Message>
  </Main>
);

const Title = props => <H1 {...props} />;

const Subtitle = props => (
  <span className={styles.subtitle} {...props}>
    {props.children}
  </span>
);

const PageDetails = ({
  className,
  title,
  subtitle,
  actionsContent,
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
        className={styles.pageDetailsTitle}
      >
        {title}
      </H1>
    ) : (
      title
    );
  return (
    <PageDetailsUI
      className={classNames(styles.customPageDetails, className)}
      {...props}
    >
      <div className={classNames(styles.pageDetailsHeader, headerClassName)}>
        <div className={classNames(styles.titleAndSubtitleWrapper, titleAndSubtitleWrapperClassName)}>
          {titleContent}
          {!!subtitle && <Subtitle>{subtitle}</Subtitle>}
        </div>
        <div className={styles.pageDetailsActions}>{actionsContent}</div>
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
  <UIMain className={classNames(styles.customMain, fillScreen && styles.customMainNoSidebar, className)} {...props} />
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
          Title,
          Tabs,
          Tab
        })}
      </ErrorBoundary>
    </Container>
  );
};

PageDetails.defaultProps = {
  actionsContent: <NewProposalButton />
};

MultipleContentpage.propTypes = {
  children: PropTypes.func,
  disableScrollToTop: PropTypes.bool
};

MultipleContentpage.defaultProps = {
  disableScrollToTop: false
};

export default MultipleContentpage;
