import React from "react";
import { classNames } from "pi-ui";
import styles from "./Diff.module.css";
import Markdown from "src/componentsv2/Markdown";
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

const DiffLineNew = ({ added = false, removed = false, content = "" }) => {
  const line = content && content.length > 0 ? content.join("") : content;
  const lineFullyAdded = added && !removed,
    lineFullyRemoved = !added && removed,
    lineChanged = added && removed;
  return (
    <div
      className={classNames(
        lineFullyAdded && styles.lineAdded,
        lineFullyRemoved && styles.lineRemoved,
        lineChanged && styles.lineChanged
      )}
    >
      {/* <span className={styles.lineContent}> */}
      <Markdown body={line}/>
      {/* </span> */}
    </div>
  );
};

DiffLine.propTypes = {
  added: PropTypes.bool,
  removed: PropTypes.bool || PropTypes.string,
  content: PropTypes.array || PropTypes.string
};

export default DiffLineNew;
