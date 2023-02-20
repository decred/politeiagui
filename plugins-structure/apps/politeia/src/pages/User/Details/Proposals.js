import React from "react";
import { useSelector } from "react-redux";
// Components
import {
  // Error as ErrorView,
  ProposalsList,
  ProposalsListEmpty,
} from "../../../components";
// Hooks
import useProposalsList from "../../../pi/hooks/useProposalsList";
import useUserInventory from "../../../pi/hooks/useUserInventory";
import { selectIsRecordsInventoryListEmpty } from "../../../pi/proposalsList/selectors";

function UserProposals({ userid }) {
  const status = "public";
  const recordsState = "vetted";

  const { onFetchNextBatch, onFetchNextInventoryPage, listFetchStatus } =
    useProposalsList({ userid });
  const { inventory, inventoryStatus } = useUserInventory({
    userid,
  });
  const isListEmpty = useSelector((state) =>
    selectIsRecordsInventoryListEmpty(state, { recordsState, status })
  );

  return isListEmpty ? (
    <ProposalsListEmpty listName="from user" />
  ) : (
    <ProposalsList
      inventory={inventory}
      inventoryFetchStatus={inventoryStatus}
      onFetchNextBatch={onFetchNextBatch}
      onFetchNextInventoryPage={onFetchNextInventoryPage}
      listFetchStatus={listFetchStatus}
    />
  );
}

export default UserProposals;
