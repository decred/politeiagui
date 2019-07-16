import React from "react";
import { classNames } from "pi-ui";
import styles from "./Diff.module.css";

const DiffLine = ({
  added = false,
  removed = false,
  removedIndex = "",
  addedIndex = "",
  content = ""
}) => (
  <tr
    className={classNames(
      added && styles.lineAdded,
      removed && styles.lineRemoved
    )}
  >
    <td className={styles.lineIndex}>{removedIndex}</td>
    <td className={styles.lineIndex}>{addedIndex}</td>
    <td className={styles.lineIcon}>{added ? "+" : removed ? "-" : ""}</td>
    <td className={styles.lineContent}>{content}</td>
  </tr>
);

export default DiffLine;
