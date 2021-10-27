import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

const DefaultLoader = () => (
  <div className="loader" key={0}>
    Loading ...
  </div>
);

const DefaultEmptyList = () => <span>Empty</span>;

const LazyList = ({
  items,
  initialLoad,
  isLoading,
  loadingPlaceholder,
  onFetchMore,
  hasMore,
  emptyListComponent,
  renderItem,
  pageStart,
  minInitialLoading
}) => {
  const isEmpty = !items.length;
  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    let timer;
    if (minInitialLoading > 0 && initialLoading) {
      timer = setTimeout(() => {
        setInitialLoading(false);
      }, minInitialLoading);
    }
    return () => {
      // clearTimeout when the component is unmounted.
      clearTimeout(timer);
    };
  }, [minInitialLoading, initialLoading]);
  const arePlaceholdersLoading = isLoading || initialLoading;
  return (
    <div data-testid="lazy-list">
      <InfiniteScroll
        pageStart={pageStart}
        loadMore={onFetchMore}
        initialLoad={initialLoad}
        hasMore={hasMore}>
        {items.map(renderItem)}
      </InfiniteScroll>
      {arePlaceholdersLoading ? (
        <div data-testid="loading-placeholders">{loadingPlaceholder}</div>
      ) : isEmpty ? (
        emptyListComponent
      ) : null}
    </div>
  );
};

LazyList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  onFetchMore: PropTypes.func.isRequired,
  initialLoad: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingPlaceholder: PropTypes.node,
  hasMore: PropTypes.bool,
  pageStart: PropTypes.number,
  minInitialLoading: PropTypes.number
};

LazyList.defaultProps = {
  initialLoad: true,
  emptyListComponent: <DefaultEmptyList />,
  loadingPlaceholder: <DefaultLoader />,
  pageStart: 0,
  minInitialLoading: 1250
  // 1250 allows the animation to complete one full cycle.
};

export default LazyList;
