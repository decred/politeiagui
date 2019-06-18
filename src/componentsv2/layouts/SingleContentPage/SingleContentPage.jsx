import React from "react";
import PropTypes from "prop-types";
import { Card, Message, Container, Main, classNames } from "pi-ui";
import styles from "./SingleContentPage.module.css";
import ErrorBoundary from "src/components/ErrorBoundary";
import Header from "src/containers/Header";

const renderError = error => <Message kind="error">{error.toString()}</Message>;

const SingleContentPage = ({ children, contentWidth }) => {
  return (
    <Container className={styles.customContainer}>
      <Header noBorder={true} />
      <Main
        fill
        className={classNames(styles.customMain, styles[contentWidth])}
      >
        <ErrorBoundary errorRenderer={renderError}>
          <Card className={styles.card}>{children}</Card>
        </ErrorBoundary>
      </Main>
    </Container>
  );
};

SingleContentPage.propTypes = {
  children: PropTypes.node.isRequired,
  contentWidth: PropTypes.oneOf(["narrow", "widen"])
};

SingleContentPage.defaultProps = {
  contentWidth: "narrow"
};

export default SingleContentPage;
