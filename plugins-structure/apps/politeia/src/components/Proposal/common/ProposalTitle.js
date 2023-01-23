import React from "react";
import { ButtonIcon, Tooltip, classNames } from "pi-ui";
import styles from "./styles.module.css";
import { getShortToken } from "@politeiagui/core";

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

function ProposalTitle({ title, isRfp, isDisabled, allowEdit, token }) {
  const shortToken = getShortToken(token);
  return (
    <div
      className={classNames(
        styles.proposalTitle,
        isDisabled && styles.disabled
      )}
    >
      {isRfp && <RfpTag />}
      <a
        data-link
        data-testid="proposal-card-title-link"
        href={`/record/${shortToken}`}
      >
        {title}
      </a>
      {allowEdit && (
        <a
          data-link
          href={`/record/${shortToken}/edit`}
          className={styles.edit}
        >
          <ButtonIcon type="edit" />
        </a>
      )}
    </div>
  );
}

export default ProposalTitle;
