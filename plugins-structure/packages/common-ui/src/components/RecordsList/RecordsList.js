import React from "react";
import styles from "./styles.module.css";

export function RecordsList({ children }) {
  return <ul className={styles.recordsList}>{children}</ul>;
}
