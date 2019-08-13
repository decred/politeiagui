import React, { useState } from "react";
import { diffWordsWithSpace } from "diff";
import styles from "./Diff.module.css";
import PropTypes from "prop-types";

const DiffStrings = ({
  newString,
  oldString,
  forceChange = false,
  rawNewString = "",
  rawOldString = ""
}) => {
  const [showTip, setShowTip] = useState(false);
  const ds = diffWordsWithSpace(oldString, newString);
  return !forceChange ? ds.map((str, key) => {
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
        <span key={1} className={styles.stringAdded}>{rawNewString}</span>
        <br/>
        <span key={2} className={styles.stringRemoved}>{rawOldString}</span>
      </span>
    }
  </>;
};

DiffStrings.propTypes = {
  newString: PropTypes.string.isRequired,
  oldString: PropTypes.string.isRequired,
  forceChange: PropTypes.bool,
  rawOldString: PropTypes.string,
  rawNewString: PropTypes.string
};

export default DiffStrings;
