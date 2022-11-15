import React, { useEffect } from "react";
import { Message } from "pi-ui";
import { RecordsList } from "@politeiagui/common-ui";
import { ProposalCard, ProposalLoader } from "..";
import max from "lodash/max";
import min from "lodash/min";
// import useStatusList from "../useStatusList";
import useProposalsList from "../../pi/hooks/useProposalsList";
import { getRfpRecordLink } from "../../pi/proposals/utils";

function LoadingSkeleton({ inventory, records }) {
  if (!inventory) return [];
  const loadingPlaceholdersCount = max([
    min([inventory.length - records.length, 5]),
    0,
  ]);
  const loadersArray = [];
  for (let i = 0; i < loadingPlaceholdersCount; i++) {
    loadersArray.push(<ProposalLoader key={i} />);
  }
  return loadersArray;
}

function ProposalInventoryList({
  status,
  inventory,
  inventoryStatus,
  onFetchNextInventoryPage,
  onRenderNextStatus,
  recordsPageSize,
  listFetchStatus,
}) {
  const {
    allRecords,
    hasMoreRecords,
    hasMoreInventory,
    countComments,
    voteSummaries,
    proposalSummaries,
    onFetchNextBatch,
    recordsInOrder,
    recordsError,
    areAllInventoryEntriesFetched,
    proposalsStatusChanges,
  } = useProposalsList({ inventory, inventoryStatus });

  function handleFetchMore() {
    if (hasMoreRecords) {
      onFetchNextBatch(status);
    } else if (hasMoreInventory) {
      onFetchNextInventoryPage();
    }
  }

  useEffect(() => {
    if (
      inventoryStatus === "succeeded/isDone" &&
      areAllInventoryEntriesFetched &&
      onRenderNextStatus
    ) {
      onRenderNextStatus();
    }
  }, [
    hasMoreInventory,
    onRenderNextStatus,
    inventoryStatus,
    areAllInventoryEntriesFetched,
  ]);

  const hasMoreToFetch = hasMoreRecords || hasMoreInventory;

  return !recordsError ? (
    <div data-testid="proposals-list">
      <RecordsList
        hasMore={hasMoreToFetch}
        onFetchMore={handleFetchMore}
        isLoading={listFetchStatus === "loading"}
        childrenThreshold={recordsPageSize}
        loadingSkeleton={
          <LoadingSkeleton inventory={inventory} records={recordsInOrder} />
        }
      >
        {recordsInOrder.map((record) => {
          const { token } = record.censorshiprecord;
          const rfpLinkTo = getRfpRecordLink(record);
          return (
            <ProposalCard
              key={token}
              record={record}
              rfpRecord={allRecords?.[rfpLinkTo]}
              commentsCount={countComments?.[token]}
              voteSummary={voteSummaries?.[token]}
              proposalSummary={proposalSummaries?.[token]}
              proposalStatusChanges={proposalsStatusChanges?.[token]}
            />
          );
        })}
      </RecordsList>
    </div>
  ) : (
    <div data-testid="proposals-list-error">
      <Message kind="error">{recordsError}</Message>
    </div>
  );
}

export default ProposalInventoryList;
