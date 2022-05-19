import React from "react";
import { InfiniteScroller } from "../InfiniteScroller";
import styles from "./styles.module.css";

export function RecordsList({ children, hasMore, onFetchMore, isLoading }) {
  function handleLoadMore() {
    onFetchMore();
  }
  return (
    <InfiniteScroller
      className={styles.recordsList}
      hasMore={hasMore}
      loadMore={handleLoadMore}
      isLoading={isLoading}
    >
      {children}
    </InfiniteScroller>
  );
}
