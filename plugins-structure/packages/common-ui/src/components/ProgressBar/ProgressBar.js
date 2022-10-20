import React from "react";
import { useSelector } from "react-redux";
import { progress } from "@politeiagui/core/globalServices";
import styles from "./styles.module.css";

export const ProgressBar = () => {
  const value = useSelector(progress.select);
  return value ? (
    <div className={styles.progressBarWrapper}>
      <div
        data-testid="common-ui-progress-bar"
        className={styles.progressBar}
        style={{ width: `${+value * 100}%` }}
      />
    </div>
  ) : null;
};
