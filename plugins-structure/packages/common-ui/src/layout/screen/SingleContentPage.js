import React from "react";
import PropTypes from "prop-types";
import { Row, StaticContainer } from "pi-ui";
import styles from "./styles.module.css";
import { SplashScreen } from "./SplashScreen";

export function SingleContentPage({ banner, children, loading }) {
  return !loading ? (
    <div>
      {banner && <Row className={styles.banner}>{banner}</Row>}
      <StaticContainer>{children}</StaticContainer>
    </div>
  ) : (
    <SplashScreen />
  );
}

SingleContentPage.propTypes = {
  banner: PropTypes.node,
  children: PropTypes.node,
  loading: PropTypes.bool,
};
