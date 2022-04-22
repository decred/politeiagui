import React from "react";
import PropTypes from "prop-types";
import { Row, StaticContainer } from "pi-ui";
import styles from "./styles.module.css";

export function SingleContentPage({ banner, children }) {
  return (
    <div>
      {banner && <Row className={styles.banner}>{banner}</Row>}
      <StaticContainer>{children}</StaticContainer>
    </div>
  );
}

SingleContentPage.propTypes = {
  banner: PropTypes.node,
  children: PropTypes.node,
  loading: PropTypes.bool,
};
