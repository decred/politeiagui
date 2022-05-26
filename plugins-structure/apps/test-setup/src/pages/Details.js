import React from "react";
import { store } from "@politeiagui/core";

export const Details = ({ token }) => (
  <div>
    <h1>Record Details</h1>
    {token && (
      <div>{JSON.stringify(store.getState().records.records[token])}</div>
    )}
    <h1>Vote Summaries</h1>
    {token && (
      <div>
        {JSON.stringify(store.getState().ticketvoteSummaries.byToken[token])}
      </div>
    )}
  </div>
);
