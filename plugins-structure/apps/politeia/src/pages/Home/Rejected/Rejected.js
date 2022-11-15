import React from "react";
import {
  ProposalsListEmpty,
  ProposalsListVoteInventory,
} from "../../../components";
import { useSelector } from "react-redux";
import { selectHomeStatus, selectIsStatusListEmpty } from "../selectors";

function Rejected() {
  const isListEmpty = useSelector((state) =>
    selectIsStatusListEmpty(state, "rejected")
  );
  const listFetchStatus = useSelector(selectHomeStatus);
  return isListEmpty ? (
    <ProposalsListEmpty status="rejected" />
  ) : (
    <ProposalsListVoteInventory
      status="rejected"
      hasBillingStatus
      listFetchStatus={listFetchStatus}
    />
  );
}

export default Rejected;
