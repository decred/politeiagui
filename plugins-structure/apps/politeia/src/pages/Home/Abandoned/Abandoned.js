import React from "react";
import { useSelector } from "react-redux";
import {
  ProposalListEmpty,
  ProposalListVoteInventory,
} from "../../../components";
import { selectHomeStatus, selectIsStatusListEmpty } from "../selectors";

function Abandoned() {
  const isListEmpty = useSelector((state) =>
    selectIsStatusListEmpty(state, "ineligible")
  );
  const listFetchStatus = useSelector(selectHomeStatus);
  return isListEmpty ? (
    <ProposalListEmpty status="abandoned" />
  ) : (
    <ProposalListVoteInventory
      status="ineligible"
      hasBillingStatus
      listFetchStatus={listFetchStatus}
    />
  );
}

export default Abandoned;
