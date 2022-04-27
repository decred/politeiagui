import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import styles from "./styles.module.css";

export function RecordsList({ children, hasMore, onFetchMore }) {
  function handleLoadMore() {
    onFetchMore();
  }
  return (
    <InfiniteScroll
      className={styles.recordsList}
      hasMore={hasMore}
      useWindow={true}
      initialLoad={true}
      loadMore={handleLoadMore}
    >
      {children}
    </InfiniteScroll>
  );
}
