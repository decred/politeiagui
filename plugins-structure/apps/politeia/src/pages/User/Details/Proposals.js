import React from "react";
import { useSelector } from "react-redux";
// Components
import {
  // Error as ErrorView,
  ProposalsList,
  ProposalsListEmpty,
} from "../../../components";
import UserDetails from "./Details";
// Hooks
import useProposalsList from "../../../pi/hooks/useProposalsList";
import useRecordsInventory from "../../../pi/hooks/useRecordsInventory";
import { selectIsRecordsInventoryListEmpty } from "../../../pi/proposalsList/selectors";

function UserProposals() {
  const status = "public";
  const recordsState = "vetted";

  const { onFetchNextBatch, onFetchNextInventoryPage, listFetchStatus } =
    useProposalsList({ status, recordsState });
  const { inventory, inventoryStatus } = useRecordsInventory({
    status,
    recordsState,
  });
  const isEmpty = useSelector((state) =>
    selectIsRecordsInventoryListEmpty(state, { recordsState, status })
  );

  return (
    <UserDetails>
      {isEmpty ? (
        <ProposalsListEmpty listName="from user" />
      ) : (
        <ProposalsList
          inventory={inventory}
          inventoryFetchStatus={inventoryStatus}
          onFetchNextBatch={onFetchNextBatch}
          onFetchNextInventoryPage={onFetchNextInventoryPage}
          listFetchStatus={listFetchStatus}
        />
      )}
    </UserDetails>
  );
}

export default UserProposals;
