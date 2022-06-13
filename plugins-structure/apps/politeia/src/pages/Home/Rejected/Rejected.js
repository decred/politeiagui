import React from "react";
import RecordsStatusList from "../common/RecordsStatusList";
import { useSelector } from "react-redux";
import EmptyList from "../common/EmptyList";
import { selectIsStatusListEmpty } from "../selectors";

function Rejected() {
  const isListEmpty = useSelector((state) =>
    selectIsStatusListEmpty(state, "rejected")
  );
  return isListEmpty ? (
    <EmptyList status="rejected" />
  ) : (
    <RecordsStatusList status={"rejected"} />
  );
}

export default Rejected;
