import React from "react";
import { MultiContentPage, TabsBanner } from "@politeiagui/common-ui/layout";
import { getURLSearchParams } from "../../utils/getURLSearchParams";
import { About } from "../../components";
import HomeProposals from "./HomeProposals";

const TAB_LABELS = {
  underReview: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  abandoned: "Abandoned",
};

const TAB_VALUES = Object.values(TAB_LABELS);

const tabs = TAB_VALUES.map((tab) => (
  <a href={`/?tab=${tab}`} data-link>
    {tab}
  </a>
));

function getListPropsByTab(tab) {
  const mapTabStatuses = {
    [TAB_LABELS.underReview]: ["started", "authorized", "unauthorized"],
    [TAB_LABELS.approved]: ["approved"],
    [TAB_LABELS.rejected]: ["rejected"],
    [TAB_LABELS.abandoned]: ["ineligible"],
  };
  const statuses =
    mapTabStatuses[tab] || mapTabStatuses[TAB_LABELS.underReview];
  const listName = mapTabStatuses[tab] ? tab.toLowerCase() : "under review";
  return { statuses, listName };
}

function Home() {
  const { tab } = getURLSearchParams();
  const { statuses, listName } = getListPropsByTab(tab);
  return (
    <MultiContentPage
      banner={
        <TabsBanner
          title="Proposals"
          activeTab={TAB_VALUES.indexOf(tab || TAB_LABELS.underReview)}
          tabs={tabs}
        />
      }
      sidebar={<About />}
    >
      <HomeProposals statuses={statuses} listName={listName} />
    </MultiContentPage>
  );
}

export default Home;
