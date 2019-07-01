import React from "react";
import {
  TopBanner,
  Main,
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
import SideBanner from "src/componentsv2/SideBanner";
import styles from "../layouts.module.css";

const renderError = error => (
  <Main className={styles.customMain}>
    <Message kind="error">{error.toString()}</Message>
  </Main>
);

const Title = props => <H1 className="margin-top-l" {...props} />;

const Subtitle = props => (
  <span className={styles.subtitle} {...props}>
    {props.children}
  </span>
);

const PageDetails = ({ className, ...props }) => (
  <PageDetailsUI
    className={classNames(styles.customPageDetails, className)}
    {...props}
  />
);

const Tab = ({ className, ...props }) => (
  <TabUI className={classNames(styles.customTab, className)} {...props} />
);

const Tabs = ({ className, ...props }) => (
  <TabsUI className={classNames(styles.customTabs, className)} {...props} />
);

const MultipleContentpage = ({ children }) => {
  return (
    <Container>
      <Header noBorder />
      <ErrorBoundary errorRenderer={renderError}>
        {children({
          Sidebar,
          TopBanner,
          SideBanner,
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

export default MultipleContentpage;
