import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function AppendObservableElement({ hasMore, isLoading, loadMore }) {
  const [intersected, setIntersected] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    if (intersected && hasMore && !isLoading) {
      setIntersected(false);
      console.log(intersected, "opa");
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
  loadingSkeleton,
}) {
  return (
    <>
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
      {isLoading && loadingSkeleton}
    </>
  );
}

InfiniteScroller.propType = {
  children: PropTypes.array.isRequired,
  loadingSkeleton: PropTypes.node,
  className: PropTypes.string,
  hasMore: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
};

export default InfiniteScroller;
