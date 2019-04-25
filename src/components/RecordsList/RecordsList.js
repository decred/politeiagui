import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import ThingLinkProposal from "../snew/ThingLink/ThingLinkProposal";
import { proposalToT3 } from "../../lib/snew";

const defaultRender = (record, index) => {
  return (
    <ThingLinkProposal
      {...{ ...proposalToT3(record, index).data, comments: [] }}
    />
  );
};

const RecordsList = ({
  records = [],
  initialLoad = true,
  isLoading,
  loadingPlaceholder,
  onFetchRecords,
  hasMore,
  renderRecord = defaultRender
}) => {
  return (
    <>
      <InfiniteScroll
        pageStart={0}
        loadMore={onFetchRecords}
        initialLoad={initialLoad}
        hasMore={hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        {records.map(renderRecord)}
      </InfiniteScroll>
      {isLoading && loadingPlaceholder}
    </>
  );
};

export default RecordsList;
