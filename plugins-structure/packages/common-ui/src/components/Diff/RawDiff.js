import React from "react";
import { diffLines } from "diff";
import styles from "./Diff.module.css";
import { classNames } from "pi-ui";

export function RawDiff({ oldText = "", newText = "" }) {
  const linesDiff = diffLines(oldText, newText);
  return (
    <pre className={styles.rawDiff}>
      {linesDiff.map((curr, key) => (
        <div
          data-testid={`raw-diff-line-${key + 1}`}
          key={key}
          className={classNames(
            curr.added ? styles.added : curr.removed ? styles.removed : ""
          )}
        >
          {curr.value}
        </div>
      ))}
    </pre>
  );
}
