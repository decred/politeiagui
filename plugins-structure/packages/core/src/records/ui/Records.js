import React from "react";
import { RecordsListWrapper } from "./RecordsList";

export function Records() {
  return (
    <>
      <RecordsListWrapper recordsState={"vetted"} status={"public"} />
      <RecordsListWrapper recordsState={"vetted"} status={"censored"} />
      <RecordsListWrapper recordsState={"vetted"} status={"archived"} />
    </>
  );
}
