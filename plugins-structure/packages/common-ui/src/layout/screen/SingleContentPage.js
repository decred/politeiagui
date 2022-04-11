import React from "react";
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
