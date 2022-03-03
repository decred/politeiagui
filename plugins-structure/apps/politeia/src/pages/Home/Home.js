import React from "react";
import { H1 } from "pi-ui";
import { recordsPolicy } from "@politeiagui/core/records/policy";
import { ticketvotePolicy } from "@politeiagui/ticketvote/policy";
import styles from "./styles.module.css";
import { getURLSearchParams } from "../../utils/getURLSearchParams";
import UnderReview from "./UnderReview/UnderReview";
import Approved from "./Approved/Approved";
import Rejected from "./Rejected/Rejected";
import Abandoned from "./Abandoned/Abandoned";

/**
 * Returns the appropriate component to render according to the search param.
 * Defaults to <UnderReview />
 */
function renderChild(props) {
  const { tab } = getURLSearchParams();
  const mapTabComponent = {
    "under review": <UnderReview {...props} />,
    approved: <Approved {...props} />,
    rejected: <Rejected {...props} />,
    abandoned: <Abandoned {...props} />,
  };
  return mapTabComponent[tab] || <UnderReview {...props} />;
}

function Home() {
  const { policyStatus: recordsPolicyStatus } = recordsPolicy.useFetch();
  const { policyStatus: ticketvotePolicyStatus } = ticketvotePolicy.useFetch();
  return recordsPolicyStatus === "succeeded" &&
    ticketvotePolicyStatus === "succeeded" ? (
    <div>
      <H1>Proposals</H1>
      <div className={styles.tabs}>
        <a href="/?tab=under review" data-link>
          Under Review
        </a>
        <a href="/?tab=approved" data-link>
          Approved
        </a>
        <a href="/?tab=rejected" data-link>
          Rejected
        </a>
        <a href="/?tab=abandoned" data-link>
          Abandoned
        </a>
      </div>
      <div>{renderChild()}</div>
    </div>
  ) : (
    "Loading ..."
  );
}

export default Home;
