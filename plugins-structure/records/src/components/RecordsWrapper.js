import React, { useState } from "react";
import { useApi } from "@politeiagui/shared-hooks";
import Records from "./Records";

function RecordsWrapper() {
  const apiInfo = useApi();
  const [tab, setTab] = useState("vetted");
  return (
    <>
      {tab === "vetted" ? <Records state={tab} status="public" /> : <Records state={tab} status="unreviewed"/>}
      <button onClick={() => tab === "vetted" ? setTab("unvetted") : setTab("vetted")}>Switch</button>
    </>
  );
}

export default RecordsWrapper;
