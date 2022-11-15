import React from "react";
import {
  ProposalListEmpty,
  ProposalListVoteInventory,
} from "../../../components";
import { selectHomeStatus, selectIsStatusListEmpty } from "../selectors";
import { useSelector } from "react-redux";

function Approved() {
  const isListEmpty = useSelector((state) =>
    selectIsStatusListEmpty(state, "approved")
  );
  const listFetchStatus = useSelector(selectHomeStatus);
  return isListEmpty ? (
    <ProposalListEmpty status="approved" />
  ) : (
    <ProposalListVoteInventory
      status="approved"
      hasBillingStatus
      listFetchStatus={listFetchStatus}
    />
  );
}

export default Approved;
