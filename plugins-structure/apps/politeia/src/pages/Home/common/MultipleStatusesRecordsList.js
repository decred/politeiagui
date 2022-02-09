import React, { useState } from "react";
import RecordsStatusList from "./RecordsStatusList";

function MultipleStatusesRecordsList({ statuses }) {
  const [statusIndex, setStatusIndex] = useState(0);

  const statusesToRender = statuses.slice(0, statusIndex + 1);

  function goToNextStatus() {
    if (statusIndex > statuses.length - 1) {
      return;
    }
    setStatusIndex(statusIndex + 1);
  }

  return statusesToRender.map((status, key) => (
    <ul key={key}>
      <RecordsStatusList status={status} goToNextStatus={goToNextStatus} />
    </ul>
  ));
}

export default MultipleStatusesRecordsList;
