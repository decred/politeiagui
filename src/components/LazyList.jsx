import React from "react";
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
  pageStart
}) => {
  const isEmpty = !items.length;
  return (
    <div data-testid="lazy-list">
      <InfiniteScroll
        pageStart={pageStart}
        loadMore={onFetchMore}
        initialLoad={initialLoad}
        hasMore={hasMore}>
        {items.map(renderItem)}
      </InfiniteScroll>
      {isLoading ? (
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
  pageStart: PropTypes.number
};

LazyList.defaultProps = {
  initialLoad: true,
  emptyListComponent: <DefaultEmptyList />,
  loadingPlaceholder: <DefaultLoader />,
  pageStart: 0
};

export default LazyList;
