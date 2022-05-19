import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function AppendObservableElement({ hasMore, isLoading, loadMore }) {
  const loaderRef = useRef(null);
  const [intersected, setIntersected] = useState(false);

  useEffect(() => {
    if (intersected && hasMore && !isLoading) {
      setIntersected(false);
      loadMore();
    }
  }, [intersected, hasMore, isLoading, loadMore]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver((entities) => {
      const target = entities[0];
      if (target.isIntersecting) {
        setIntersected(true);
      } else {
        setIntersected(false);
      }
    }, options);

    const currentLoaderRef = loaderRef.current;
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.unobserve(currentLoaderRef);
    };
  }, []);
  return <div ref={loaderRef}></div>;
}

function InfiniteScroller({
  children,
  className,
  hasMore,
  isLoading,
  loadMore,
}) {
  return (
    <div className={className}>
      {children}
      {children.length > 0 && (
        <AppendObservableElement
          hasMore={hasMore}
          isLoading={isLoading}
          loadMore={loadMore}
        />
      )}
    </div>
  );
}

InfiniteScroller.propType = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  hasMore: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
};

export default InfiniteScroller;
