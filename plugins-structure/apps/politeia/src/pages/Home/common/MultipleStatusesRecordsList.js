import React, { useState } from "react";
import RecordsStatusList from "./RecordsStatusList";

function MultipleStatusesRecordsList({ statuses }) {
  const [statusIndex, setStatusIndex] = useState(0);

  const statusesToRender = statuses.slice(0, statusIndex + 1);

  function handleRenderNextStatus() {
    if (statusIndex > statuses.length - 1) {
      return;
    }
    setStatusIndex(statusIndex + 1);
  }

  return statusesToRender.map((status, key) => (
    <ul key={key}>
      <RecordsStatusList
        status={status}
        onRenderNextStatus={
          key === statusesToRender.length - 1 ? handleRenderNextStatus : null
        }
      />
    </ul>
  ));
}

export default MultipleStatusesRecordsList;
