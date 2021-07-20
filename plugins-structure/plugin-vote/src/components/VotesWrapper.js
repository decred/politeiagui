import React from "react";
import { Approved, Rejected, Abandoned, UnderReview } from "./Votes";
import { useApi } from "@politeiagui/shared-hooks";

function VotesWrapper() {
  const apiInfo = useApi();
  return (
    <>
      <h1>Hey votes!</h1>
      <div style={{display: "flex"}}>
        <Approved />
        <Rejected />
        <Abandoned />
        <UnderReview />
      </div>
    </>
  );
};

export default VotesWrapper;