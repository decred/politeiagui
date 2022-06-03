import React from "react";
import RecordsStatusList from "../common/RecordsStatusList";
import { useSelector } from "react-redux";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import isEmpty from "lodash/isEmpty";
import EmptyList from "../common/EmptyList";

function Abandoned() {
  const [tokens, status] = useSelector((state) => [
    ticketvoteInventory.selectByStatus(state, "ineligible"),
    ticketvoteInventory.selectStatus(state, { status: "ineligible" }),
  ]);
  const isListEmpty = isEmpty(tokens) && status === "succeeded/isDone";
  return isListEmpty ? (
    <EmptyList status="abandoned" />
  ) : (
    <RecordsStatusList status={"ineligible"} />
  );
}

export default Abandoned;
