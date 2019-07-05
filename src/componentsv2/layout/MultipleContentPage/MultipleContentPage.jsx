import React from "react";
import {
  TopBanner,
  Main as UIMain,
  PageDetails as PageDetailsUI,
  H1,
  Container,
  Message,
  Tabs as TabsUI,
  Tab as TabUI,
  classNames
} from "pi-ui";
import ErrorBoundary from "src/components/ErrorBoundary";
import Header from "src/containers/Header/Header";
import Sidebar from "../../Sidebar";
import NewProposalButton from "src/componentsv2/NewProposalButton";
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
  ...props
}) => {
  const titleContent =
    typeof title === "string" ? (
      <H1
        id="proposal-title"
        truncate
        linesBeforeTruncate={3}
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
        {titleContent}
        <div className={styles.pageDetailsActions}>{actionsContent}</div>
      </div>
      {!!subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
    </PageDetailsUI>
  );
};

const Tab = ({ className, ...props }) => (
  <TabUI className={classNames(styles.customTab, className)} {...props} />
);

const Tabs = ({ className, ...props }) => (
  <TabsUI className={classNames(styles.customTabs, className)} {...props} />
);

const Main = ({ className, ...props }) => (
  <UIMain className={classNames(styles.customMain, className)} {...props} />
);

const MultipleContentpage = ({ children }) => {
  return (
    <Container>
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

export default MultipleContentpage;
