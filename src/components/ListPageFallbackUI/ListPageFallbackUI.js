import React from "react";
import { Tabs, Tab } from "../Tabs";
import LoadingIcon from "../snew/LoadingIcon";

const ListPageFallbackUI = () => (
  <div className="content">
    <h1 className="content-title">Public Proposals</h1>
    <Tabs>
      <Tab title="In Discusssion" count={""} />
      <Tab title="Voting" count={""} />
      <Tab title="Approved" count={""} />
      <Tab title="Rejected" count={""} />
      <Tab title="Abandoned" count={""} />
    </Tabs>
    <LoadingIcon
      width={200}
      style={{ paddingTop: "100px", margin: "0 auto" }}
    />
  </div>
);

export default ListPageFallbackUI;
