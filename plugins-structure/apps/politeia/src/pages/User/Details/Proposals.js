import React from "react";
// Components
import ProposalsList from "../../../components/ProposalsList/ProposalsList";
import UserDetails from "./Details";
// Hooks
import useProposalsList from "../../../pi/hooks/useProposalsList";
import useRecordsInventory from "../../../pi/hooks/useRecordsInventory";

function UserProposals() {
  const status = "public";
  const recordsState = "vetted";

  const { onFetchNextBatch, onFetchNextInventoryPage, listFetchStatus } =
    useProposalsList({ status, recordsState });
  const { inventory, inventoryStatus } = useRecordsInventory({
    status,
    recordsState,
  });

  return (
    <UserDetails tab={"proposals"}>
      <ProposalsList
        inventory={inventory}
        inventoryFetchStatus={inventoryStatus}
        onFetchNextBatch={onFetchNextBatch}
        onFetchNextInventoryPage={onFetchNextInventoryPage}
        listFetchStatus={listFetchStatus}
      />
    </UserDetails>
  );
}

export default UserProposals;
