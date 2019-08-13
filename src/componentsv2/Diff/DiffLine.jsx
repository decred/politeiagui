import React from "react";
import { classNames } from "pi-ui";
import styles from "./Diff.module.css";
import Markdown from "src/componentsv2/Markdown";

const DiffLine = ({
  added = false,
  removed = false,
  content = ""
}) => {
  const line = content && content.length > 0 ? content.join("") : content;
  return (
    <tr
      className={classNames(
        added && styles.lineAdded,
        removed && styles.lineRemoved
      )}
    >
      <td className={styles.lineContent}>
        <Markdown
          body={line}
        />
      </td>
    </tr>
  );
};

export default DiffLine;
