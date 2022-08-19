import React from "react";
import { MultiContentPage, TabsBanner } from "@politeiagui/common-ui/layout";
import { getURLSearchParams } from "../../utils/getURLSearchParams";
import { About } from "../../components";
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

const tabs = TAB_VALUES.map((tab) => (
  <a href={`/?tab=${tab}`} data-link>
    {tab}
  </a>
));

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
      {renderChild({ tab })}
    </MultiContentPage>
  );
}

export default Home;
