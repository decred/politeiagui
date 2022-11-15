import React from "react";
import {
  ProposalListEmpty,
  ProposalListVoteInventory,
} from "../../../components";
import { useSelector } from "react-redux";
import { selectHomeStatus, selectIsStatusListEmpty } from "../selectors";

function Rejected() {
  const isListEmpty = useSelector((state) =>
    selectIsStatusListEmpty(state, "rejected")
  );
  const listFetchStatus = useSelector(selectHomeStatus);
  return isListEmpty ? (
    <ProposalListEmpty status="rejected" />
  ) : (
    <ProposalListVoteInventory
      status="rejected"
      hasBillingStatus
      listFetchStatus={listFetchStatus}
    />
  );
}

export default Rejected;
