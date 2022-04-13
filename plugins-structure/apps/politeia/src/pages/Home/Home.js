import React from "react";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { router } from "@politeiagui/core/router";
import { MultiContentPage, TabsBanner } from "@politeiagui/common-ui/layout";
import { ticketvotePolicy } from "@politeiagui/ticketvote/policy";
import { getURLSearchParams } from "../../utils/getURLSearchParams";
import UnderReview from "./UnderReview/UnderReview";
import Approved from "./Approved/Approved";
import Rejected from "./Rejected/Rejected";
import Abandoned from "./Abandoned/Abandoned";

const TAB_LABELS = {
  underReview: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  abandoned: "Abandoned",
};

const TAB_VALUES = Object.values(TAB_LABELS);

/**
 * Returns the appropriate component to render according to the search param.
 * Defaults to <UnderReview />
 */
function renderChild({ tab, ...props }) {
  const mapTabComponent = {
    [TAB_LABELS.underReview]: <UnderReview {...props} />,
    [TAB_LABELS.approved]: <Approved {...props} />,
    [TAB_LABELS.rejected]: <Rejected {...props} />,
    [TAB_LABELS.abandoned]: <Abandoned {...props} />,
  };
  return mapTabComponent[tab] || <UnderReview {...props} />;
}

function Home() {
  const { tab } = getURLSearchParams();
  const { policyStatus: recordsPolicyStatus } = recordsPolicy.useFetch();
  const { policyStatus: ticketvotePolicyStatus } = ticketvotePolicy.useFetch();
  function handleSelectTab(index) {
    const selectedTab = TAB_VALUES[index];
    router.navigateTo(`/?tab=${selectedTab}`);
  }
  const loading =
    recordsPolicyStatus !== "succeeded" ||
    ticketvotePolicyStatus !== "succeeded";
  return (
    <MultiContentPage
      loading={loading}
      banner={
        <TabsBanner
          onSelectTab={handleSelectTab}
          title="Proposals"
          activeTab={TAB_VALUES.indexOf(tab)}
          tabs={TAB_VALUES}
        />
      }
      sidebar={"About Politeia"}
    >
      {renderChild({ tab })}
    </MultiContentPage>
  );
}

export default Home;
