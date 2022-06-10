import React, { useState } from "react";
import { Tab, Tabs } from "pi-ui";
import UserDraftInvoices from "src/containers/Invoice/User/Drafts";
import UserDraftDccs from "src/containers/DCC/User/Drafts";

const Drafts = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <Tabs
      mode="dropdown"
      onSelectTab={setActiveTabIndex}
      activeTabIndex={activeTabIndex}
    >
      <Tab label="Invoices">
        <UserDraftInvoices />
      </Tab>
      <Tab label="DCCs">
        <UserDraftDccs />
      </Tab>
    </Tabs>
  );
};

export default Drafts;
