import React, { useState } from "react";
import { diffWordsWithSpace } from "diff";
import styles from "./Diff.module.css";
import PropTypes from "prop-types";

const DiffStrings = ({
  newString = "",
  oldString = "",
  propChanges = false,
  newLink = "",
  oldLink = ""
}) => {
  const [showTip, setShowTip] = useState(false);
  const ds = diffWordsWithSpace(oldString, newString);
  return !propChanges ? ds.map((str, key) => {
    if (str.added) {
      return <span key={key} className={styles.stringAdded}>{str.value}</span>;
    }
    if (str.removed) {
      return <span key={key} className={styles.stringRemoved}>{str.value}</span>;
    }
    return str.value;
  }) :
  <>
    <span
      className={styles.stringChanged}
      onMouseEnter={() => { setShowTip(true); }}
      onMouseLeave={() => { setShowTip(false); }}
    >
      {newString}
    </span>
    {showTip &&
      <span className={styles.changedTip}>
        <span key={1} className={styles.stringAdded}>{newLink}</span>
        <br/>
        <span key={2} className={styles.stringRemoved}>{oldLink}</span>
      </span>
    }
  </>;
};

DiffStrings.propTypes = {
  newString: PropTypes.string.isRequired,
  oldString: PropTypes.string,
  propChanges: PropTypes.bool,
  oldLink: PropTypes.string,
  newLink: PropTypes.string
};

export default DiffStrings;
