import React from "react";
import RecordsStatusList from "../common/RecordsStatusList";
import { useSelector } from "react-redux";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import isEmpty from "lodash/isEmpty";
import EmptyList from "../common/EmptyList";

function Approved() {
  const [tokens, status] = useSelector((state) => [
    ticketvoteInventory.selectByStatus(state, "approved"),
    ticketvoteInventory.selectStatus(state, { status: "approved" }),
  ]);
  const isListEmpty = isEmpty(tokens) && status === "succeeded/isDone";
  return isListEmpty ? (
    <EmptyList status="approved" />
  ) : (
    <RecordsStatusList status={"approved"} />
  );
}

export default Approved;
