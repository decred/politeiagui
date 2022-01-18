import React from "react";
import { Card, H2 } from "pi-ui";
import styles from "./styles.module.css";

export function RecordCard({ token }) {
  return (
    <Card className={styles.card}>
      <div className={styles.firstRow}>
        <div className={styles.header}>
          <a href={`/records/${token}`} data-link className={styles.title}>
            <H2>I am {token}!</H2>
          </a>
          <p className={styles.subtitle}>subsubsub</p>
        </div>
        <div>placeholder</div>
      </div>
      <div className={styles.secondRow}>placeholder</div>
      <div className={styles.thirdRow}>
        <div>placeholder</div>
        <div>placeholder</div>
      </div>
    </Card>
  );
}
