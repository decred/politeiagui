import React from "react";
import {
  ProposalsListEmpty,
  ProposalsListVoteInventory,
} from "../../../components";
import { selectHomeStatus, selectIsStatusListEmpty } from "../selectors";
import { useSelector } from "react-redux";

function Approved() {
  const isListEmpty = useSelector((state) =>
    selectIsStatusListEmpty(state, "approved")
  );
  const listFetchStatus = useSelector(selectHomeStatus);
  return isListEmpty ? (
    <ProposalsListEmpty status="approved" />
  ) : (
    <ProposalsListVoteInventory
      status="approved"
      hasBillingStatus
      listFetchStatus={listFetchStatus}
    />
  );
}

export default Approved;
