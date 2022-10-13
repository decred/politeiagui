import React from "react";
import { useSelector } from "react-redux";
import { progress } from "../../services";
import styles from "./styles.module.css";

export const ProgressBar = () => {
  const value = useSelector(progress.select);
  return (
    <div
      data-testid="common-ui-progress-bar"
      className={styles.progressBar}
      style={{ width: `${+value * 100}%` }}
    />
  );
};
