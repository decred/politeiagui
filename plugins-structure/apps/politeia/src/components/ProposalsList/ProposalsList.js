import React from "react";
// Components
import { RecordsList } from "@politeiagui/common-ui";
import ErrorView from "../Error/Error";
import ProposalCard from "../Proposal/ProposalCard";
import ProposalLoader from "../Proposal/ProposalLoader";
// Hooks
import useProposals from "../../pi/hooks/useProposals";
// Utils
import { getRfpRecordLink } from "../../pi/proposals/utils";

function ProposalsList({
  inventory,
  inventoryFetchStatus,
  error,
  listFetchStatus,
  onFetchNextBatch,
  onFetchNextInventoryPage,
  onFetchDone,
}) {
  const {
    records,
    countComments,
    proposalSummaries,
    proposalsStatusChanges,
    voteSummaries,
  } = useProposals();

  return error ? (
    <ErrorView error={error} />
  ) : (
    <div>
      <RecordsList
        inventory={inventory}
        records={records}
        inventoryFetchStatus={inventoryFetchStatus}
        listFetchStatus={listFetchStatus}
        onFetchNextBatch={onFetchNextBatch}
        onFetchNextInventoryPage={onFetchNextInventoryPage}
        onFetchDone={onFetchDone}
        loadingPlaceholder={ProposalLoader}
      >
        {(recordsList) =>
          recordsList.map((record) => {
            const { token } = record.censorshiprecord;
            const rfpLinkTo = getRfpRecordLink(record);
            return (
              <ProposalCard
                key={token}
                record={record}
                rfpRecord={records?.[rfpLinkTo]}
                commentsCount={countComments?.[token]}
                voteSummary={voteSummaries?.[token]}
                proposalSummary={proposalSummaries?.[token]}
                proposalStatusChanges={proposalsStatusChanges?.[token]}
              />
            );
          })
        }
      </RecordsList>
    </div>
  );
}

export default ProposalsList;
