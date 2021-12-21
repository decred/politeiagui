import React from "react";
import RecordsList from "../ui/RecordsList";

function Records() {
  return (
    <>
      <h1>Records</h1>
      <h3>Vetted</h3>
      <h3>Public</h3>
      <RecordsList recordsState={"vetted"} status={"public"} />
      <h3>Vetted</h3>
      <h3>Censored</h3>
      <RecordsList recordsState={"vetted"} status={"censored"} />
      <h3>Vetted</h3>
      <h3>Archived</h3>
      <RecordsList recordsState={"vetted"} status={"archived"} />
    </>
  );
}

export default Records;
