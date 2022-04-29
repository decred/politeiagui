import React from "react";
import { Card, Column, H2, Row } from "pi-ui";
import styles from "./styles.module.css";

export function RecordCard({
  title,
  titleLink,
  subtitle,
  rightHeader,
  secondRow,
  thirdRow,
  fourthRow,
  footer,
}) {
  return (
    <Card className={styles.card}>
      <Row>
        <Column xs={12} sm={7}>
          {!titleLink ? (
            <H2>{title}</H2>
          ) : (
            <H2>
              <a href={titleLink} data-link className={styles.title}>
                {title}
              </a>
            </H2>
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
      {fourthRow && <div className={styles.fourthRow}>{fourthRow}</div>}
      <div className={styles.footer}>{footer}</div>
    </Card>
  );
}
