import React from "react";
import PropTypes from "prop-types";
import { Row, StaticContainer } from "pi-ui";
import styles from "./styles.module.css";

export function SingleContentPage({ banner, children, className }) {
  return (
    <div>
      {banner && <Row className={styles.singlePageBanner}>{banner}</Row>}
      <StaticContainer className={className}>{children}</StaticContainer>
    </div>
  );
}

SingleContentPage.propTypes = {
  banner: PropTypes.node,
  children: PropTypes.node,
  loading: PropTypes.bool,
};
