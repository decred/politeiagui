import React from "react";
import styles from "./styles.module.css";

export function RecordsList({ children, hasMore, onFetchMore }) {
  function handleLoadMore() {
    onFetchMore();
  }
  return (
    <div>
      <div className={styles.recordsList}>{children}</div>
      <button disabled={!hasMore} onClick={handleLoadMore}>
        Fetch More
      </button>
    </div>
  );
}
