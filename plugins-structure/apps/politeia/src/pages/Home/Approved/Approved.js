import React from "react";
import RecordsStatusList from "../common/RecordsStatusList";
import EmptyList from "../common/EmptyList";
import { selectIsStatusListEmpty } from "../selectors";
import { useSelector } from "react-redux";

function Approved() {
  const isListEmpty = useSelector((state) =>
    selectIsStatusListEmpty(state, "approved")
  );
  return isListEmpty ? (
    <EmptyList status="approved" />
  ) : (
    <RecordsStatusList status={"approved"} />
  );
}

export default Approved;
