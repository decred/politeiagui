import React from "react";
import { Card, Column, H2, Row } from "pi-ui";
import styles from "./styles.module.css";

export function RecordCard({
  token,
  title,
  subtitle,
  rightHeader,
  secondRow,
  thirdRow,
  footer,
  titleWithoutLink,
}) {
  return (
    <Card className={styles.card}>
      <Row>
        <Column xs={12} sm={7}>
          {titleWithoutLink ? (
            <H2>{title}</H2>
          ) : (
            <a href={`/records/${token}`} data-link className={styles.title}>
              <H2>{title}</H2>
            </a>
          )}
        </Column>
        <Column xs={12} sm={5} className={styles.rightHeader}>
          {rightHeader}
        </Column>
        <Column xs={12}>
          <div className={styles.subtitle}>{subtitle}</div>
        </Column>
      </Row>
      {secondRow && <Row className={styles.secondRow}>{secondRow}</Row>}
      {thirdRow && <Row className={styles.thirdRow}>{thirdRow}</Row>}
      <div className={styles.footer}>{footer}</div>
    </Card>
  );
}
