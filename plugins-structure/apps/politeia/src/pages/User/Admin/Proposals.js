import React from "react";
import { useSelector } from "react-redux";
import { getURLSearchParams } from "@politeiagui/core/router";
import { SingleContentPage, TabsBanner } from "@politeiagui/common-ui/layout";
import useProposalsList from "../../../pi/hooks/useProposalsList";
import useRecordsInventory from "../../../pi/hooks/useRecordsInventory";
import { selectIsRecordsInventoryListEmpty } from "../../../pi/proposalsList/selectors";
import { ProposalsList, ProposalsListEmpty } from "../../../components";

const recordsState = "unvetted";
const TABS = {
  unreviewed: "Unreviewed",
  censored: "Censored",
};
const TABS_VALUES = Object.values(TABS);
const tabsLinks = TABS_VALUES.map((tab) => (
  <a href={`/admin/records?tab=${tab}`} data-link>
    {tab}
  </a>
));

function AdminProposalsList({ status, listName }) {
  const { onFetchNextBatch, onFetchNextInventoryPage, listFetchStatus } =
    useProposalsList({ status, recordsState });
  const { inventory, inventoryStatus } = useRecordsInventory({
    status,
    recordsState,
  });
  const isListEmpty = useSelector((state) =>
    selectIsRecordsInventoryListEmpty(state, { recordsState, status })
  );
  return isListEmpty ? (
    <ProposalsListEmpty listName={listName} />
  ) : (
    <ProposalsList
      inventory={inventory}
      inventoryFetchStatus={inventoryStatus}
      onFetchNextBatch={onFetchNextBatch}
      onFetchNextInventoryPage={onFetchNextInventoryPage}
      listFetchStatus={listFetchStatus}
    />
  );
}

function getListPropsByTab(tab) {
  const mapTabStatus = {
    [TABS.unreviewed]: "unreviewed",
    [TABS.censored]: "censored",
  };
  const status = mapTabStatus[tab] || mapTabStatus[TABS.unreviewed];
  const listName = mapTabStatus[tab] ? tab.toLowerCase() : "unreviewed";
  return { status, listName };
}

function AdminProposalsPage() {
  const { tab } = getURLSearchParams();
  const { status, listName } = getListPropsByTab(tab);
  return (
    <SingleContentPage
      banner={
        <TabsBanner
          title="Unvetted Proposals"
          activeTab={TABS_VALUES.indexOf(tab || TABS_VALUES[0])}
          tabs={tabsLinks}
        />
      }
    >
      <AdminProposalsList listName={listName} status={status} />
    </SingleContentPage>
  );
}

export default AdminProposalsPage;
