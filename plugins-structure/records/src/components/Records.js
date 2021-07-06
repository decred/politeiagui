import React from "react";
import { useApi } from "@politeiagui/shared-hooks";
import { useRecordsInventory } from "../hooks/useRecordsInventory";
import { useRecords } from "../hooks/useRecords";

function Records() {
  const apiInfo = useApi();
  console.log(apiInfo);
  const recordsInventoryInfo = useRecordsInventory({state: 2, status: 2, page: 1});
  console.log(recordsInventoryInfo);
  const records = useRecords({state: 2, status: 2, records: recordsInventoryInfo.data?.vetted.public});
  console.log(records);
  return <h1>Hey, I am records</h1>;
}

export default Records;
