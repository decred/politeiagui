import React from "react";
import styles from "./styles.module.css";

function EmptyList({ listName }) {
  return (
    <div className={styles.emptyList} data-testid="proposals-list-empty">
      No proposals {listName}
    </div>
  );
}

export default EmptyList;
