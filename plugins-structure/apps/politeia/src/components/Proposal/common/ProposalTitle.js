import React from "react";
import { Tooltip, classNames } from "pi-ui";
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

function ProposalTitle({ title, isRfp, isDisabled }) {
  return (
    <div
      className={classNames(
        styles.proposalTitle,
        isDisabled && styles.disabled
      )}
    >
      {isRfp && <RfpTag />}
      {title}
    </div>
  );
}

export default ProposalTitle;
