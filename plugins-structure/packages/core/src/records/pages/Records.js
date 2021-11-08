import React from "react";
import { RecordsList } from "../ui/RecordsList";

function Records() {
  return (
    <>
      <RecordsList recordsState={"vetted"} status={"public"} />
      <RecordsList recordsState={"vetted"} status={"censored"} />
      <RecordsList recordsState={"vetted"} status={"archived"} />
    </>
  );
}

export default Records;
