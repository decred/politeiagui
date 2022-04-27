import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { router } from "@politeiagui/core/router";
import { api } from "@politeiagui/core/api";
import { MultiContentPage, TabsBanner } from "@politeiagui/common-ui/layout";
import { ticketvotePolicy } from "@politeiagui/ticketvote/policy";
import { getURLSearchParams } from "../../utils/getURLSearchParams";
import UnderReview from "./UnderReview/UnderReview";
import Approved from "./Approved/Approved";
import Rejected from "./Rejected/Rejected";
import Abandoned from "./Abandoned/Abandoned";

import { useStoreEffect } from "@politeiagui/core/listeners";

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
  const dispatch = useDispatch();
  const recordsPolicyStatus = useSelector(recordsPolicy.selectStatus);
  const ticketvotePolicyStatus = useSelector(ticketvotePolicy.selectStatus);

  function handleSelectTab(index) {
    const selectedTab = TAB_VALUES[index];
    router.navigateTo(`/?tab=${selectedTab}`);
  }

  useStoreEffect(() => {
    if (recordsPolicyStatus === "idle") dispatch(ticketvotePolicy.fetch());
    if (ticketvotePolicyStatus === "idle") dispatch(recordsPolicy.fetch());
  }, [api.fetch.fulfilled]);

  const loading =
    recordsPolicyStatus !== "succeeded" ||
    ticketvotePolicyStatus !== "succeeded";

  return (
    <MultiContentPage
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
      {!loading && renderChild({ tab })}
    </MultiContentPage>
  );
}

export default Home;
