import React from "react";
import { classNames } from "pi-ui";
import styles from "./Diff.module.css";
import Markdown from "src/components/Markdown";
import PropTypes from "prop-types";

const DiffLine = ({ added = false, removed = false, content = "" }) => {
  const line = content && content.length > 0 ? content.join("") : content;
  return (
    <tr
      className={classNames(
        added && styles.lineAdded,
        removed && styles.lineRemoved
      )}
    >
      <td className={styles.lineContent}>
        <Markdown body={line} />
      </td>
    </tr>
  );
};

DiffLine.propTypes = {
  added: PropTypes.bool,
  removed: PropTypes.bool,
  content: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
};

export default DiffLine;
