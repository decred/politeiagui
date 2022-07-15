import React from "react";
import RecordsStatusList from "../common/RecordsStatusList";
import { useSelector } from "react-redux";
import { selectIsStatusListEmpty } from "../selectors";
import EmptyList from "../common/EmptyList";

function Abandoned() {
  const isListEmpty = useSelector((state) =>
    selectIsStatusListEmpty(state, "ineligible")
  );
  return isListEmpty ? (
    <EmptyList status="abandoned" />
  ) : (
    <RecordsStatusList status={"ineligible"} />
  );
}

export default Abandoned;
