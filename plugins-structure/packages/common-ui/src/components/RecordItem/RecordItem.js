import React from "react";
import { Column, Row } from "pi-ui";
import styles from "./styles.module.css";

export function RecordItem({ title }) {
  return (
    <Row className={styles.itemWrapper}>
      <Column sm={12} md={6} lg={4}>
        <p className={styles.itemTitle}>{title}</p>
      </Column>
    </Row>
  );
}
