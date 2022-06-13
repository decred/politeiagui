import React from "react";
import PropTypes from "prop-types";
import { Card, Message, Container, Main, classNames } from "pi-ui";
import styles from "../layouts.module.css";
import ErrorBoundary from "src/components/ErrorBoundary";
import Header from "src/containers/Header";
import useScrollToTop from "src/hooks/utils/useScrollToTop";

const renderError = (error) => (
  <Message kind="error">{error.toString()}</Message>
);

const SingleContentPage = ({
  children,
  contentWidth,
  disableScrollToTop,
  noCardWrap
}) => {
  useScrollToTop(disableScrollToTop);
  return (
    <Container className={styles.customContainer} singleContent>
      <Header noBorder={true} />
      <Main
        fill
        className={classNames(styles.singleContentMain, styles[contentWidth])}
      >
        <ErrorBoundary errorRenderer={renderError}>
          {noCardWrap ? (
            children
          ) : (
            <Card className={styles.card}>{children}</Card>
          )}
        </ErrorBoundary>
      </Main>
    </Container>
  );
};

SingleContentPage.propTypes = {
  children: PropTypes.node.isRequired,
  contentWidth: PropTypes.oneOf(["narrow", "widen"]),
  disableScrollToTop: PropTypes.bool,
  noCardWrap: PropTypes.bool
};

SingleContentPage.defaultProps = {
  contentWidth: "narrow",
  disableScrollToTop: false,
  noCardWrap: false
};

export default SingleContentPage;
