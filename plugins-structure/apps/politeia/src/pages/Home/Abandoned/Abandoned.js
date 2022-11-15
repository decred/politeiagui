import React from "react";
import { useSelector } from "react-redux";
import {
  ProposalsListEmpty,
  ProposalsListVoteInventory,
} from "../../../components";
import { selectHomeStatus, selectIsStatusListEmpty } from "../selectors";

function Abandoned() {
  const isListEmpty = useSelector((state) =>
    selectIsStatusListEmpty(state, "ineligible")
  );
  const listFetchStatus = useSelector(selectHomeStatus);
  return isListEmpty ? (
    <ProposalsListEmpty status="abandoned" />
  ) : (
    <ProposalsListVoteInventory
      status="ineligible"
      hasBillingStatus
      listFetchStatus={listFetchStatus}
    />
  );
}

export default Abandoned;
