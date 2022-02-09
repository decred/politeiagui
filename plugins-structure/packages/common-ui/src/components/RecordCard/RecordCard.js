import React from "react";
import { Card, H2 } from "pi-ui";
import styles from "./styles.module.css";

export function RecordCard({
  token,
  title,
  subtitle,
  rightHeader,
  secondRow,
  thirdRow,
  footer,
}) {
  return (
    <Card className={styles.card}>
      <div className={styles.firstRow}>
        <div className={styles.header}>
          <a href={`/records/${token}`} data-link className={styles.title}>
            <H2>{title}</H2>
          </a>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
        <div>{rightHeader}</div>
      </div>
      <div className={styles.secondRow}>{secondRow}</div>
      <div className={styles.thirdRow}>
        <div className={styles.fullRow}>{thirdRow}</div>
      </div>
      <div className={styles.footer}>{footer}</div>
    </Card>
  );
}
