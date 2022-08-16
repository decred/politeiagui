import React from "react";
import { Tooltip } from "pi-ui";
import styles from "./styles.module.css";

function RfpTag() {
  return (
    <Tooltip
      contentClassName={styles.rfpTooltip}
      className={styles.rfpTag}
      placement="bottom"
      data-testid="proposal-rfp-tag"
      content={
        <span>
          <b>Request for Proposals</b>. When approved, this proposal is able to
          receive submissions related to its subject.
        </span>
      }
    >
      <div>RFP</div>
    </Tooltip>
  );
}

function ProposalTitle({ title, isRfp }) {
  return (
    <div className={styles.proposalTitle}>
      {isRfp && <RfpTag />}
      {title}
    </div>
  );
}

export default ProposalTitle;
