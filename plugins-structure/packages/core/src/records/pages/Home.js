import React from "react";
import Records from "./Records";
import { recordsPolicy } from "@politeiagui/core/records/policy";

function Home() {
  const { policyStatus } = recordsPolicy.useFetch();
  return policyStatus === "succeeded" ? (
    <Records />
  ) : (
    <h1>Loading policy...</h1>
  );
}

export default Home;
