import React from "react";
import MultipleStatusesRecordsList from "../common/MultipleStatusesRecordsList";

function UnderReviewPage() {
  const statuses = ["started", "authorized", "unauthorized"];
  return <MultipleStatusesRecordsList statuses={statuses} />;
}

export default UnderReviewPage;
