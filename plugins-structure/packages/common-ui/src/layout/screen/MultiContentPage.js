import React from "react";
import PropTypes from "prop-types";
import { Column, Row, StaticContainer } from "pi-ui";
import styles from "./styles.module.css";
import { SplashScreen } from "./SplashScreen";

export function MultiContentPage({ banner, children, sidebar, loading }) {
  return !loading ? (
    <div>
      {banner && <Row className={styles.banner}>{banner}</Row>}
      <StaticContainer className={styles.container}>
        <Row>
          <Column sm={12} lg={8}>
            {children}
          </Column>
          <Column sm={0} lg={4}>
            {sidebar}
          </Column>
        </Row>
      </StaticContainer>
    </div>
  ) : (
    <SplashScreen />
  );
}

MultiContentPage.propTypes = {
  banner: PropTypes.node,
  children: PropTypes.node,
  sidebar: PropTypes.node,
  loading: PropTypes.bool,
};
