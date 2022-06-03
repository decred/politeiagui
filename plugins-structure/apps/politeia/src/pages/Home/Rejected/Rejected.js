import React from "react";
import RecordsStatusList from "../common/RecordsStatusList";
import { useSelector } from "react-redux";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import isEmpty from "lodash/isEmpty";
import EmptyList from "../common/EmptyList";

function Rejected() {
  const [tokens, status] = useSelector((state) => [
    ticketvoteInventory.selectByStatus(state, "rejected"),
    ticketvoteInventory.selectStatus(state, { status: "rejected" }),
  ]);
  const isListEmpty = isEmpty(tokens) && status === "succeeded/isDone";
  return isListEmpty ? (
    <EmptyList status="rejected" />
  ) : (
    <RecordsStatusList status={"rejected"} />
  );
}

export default Rejected;
