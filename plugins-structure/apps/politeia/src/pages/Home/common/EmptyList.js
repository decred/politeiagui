import React from "react";
import styles from "../styles.module.css";

function EmptyList({ status }) {
  return <div className={styles.emptyList}>No proposals {status}</div>;
}

export default EmptyList;
