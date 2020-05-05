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
    <>
      <InfiniteScroll
        pageStart={pageStart}
        loadMore={onFetchMore}
        initialLoad={initialLoad}
        hasMore={hasMore}>
        {items.map(renderItem)}
      </InfiniteScroll>
      {isLoading ? loadingPlaceholder : isEmpty ? emptyListComponent : null}
    </>
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
