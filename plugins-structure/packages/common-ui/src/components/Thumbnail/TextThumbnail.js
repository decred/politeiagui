import React from "react";
import { P, classNames } from "pi-ui";
import styles from "./styles.module.css";

export function TextThumbnail() {
  return (
    <div className={classNames(styles.fileThumbnailWrapper)}>
      <div className={styles.fileThumbnail}>
        <P className={styles.fileThumbnailText}>.txt</P>
      </div>
    </div>
  );
}
