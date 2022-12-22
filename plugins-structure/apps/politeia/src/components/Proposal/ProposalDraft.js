import React from "react";
import { Event, Join, RecordCard } from "@politeiagui/common-ui";
import { decodeProposalDraftForm } from "../../pi/proposals/utils";
import { ProposalTitle } from "./common";
import { PROPOSAL_TYPE_RFP } from "../../pi";
import { ButtonIcon } from "pi-ui";
import styles from "./styles.module.css";

function DraftCard({ draft, draftid, onDelete }) {
  const { name, type } = decodeProposalDraftForm(draft.record);

  return (
    <div data-testid="draft-card">
      <RecordCard
        titleLink={`/record/new?draft=${draftid}`}
        title={
          <ProposalTitle
            title={name || "Empty"}
            isDisabled={!name}
            isRfp={type === PROPOSAL_TYPE_RFP}
          />
        }
        subtitle={
          <Join inline>
            <span>Proposal Draft</span>
            <Event timestamp={draft.timestamp} />
          </Join>
        }
        rightHeader={
          <div className={styles.buttons}>
            <a data-link href={`/record/new?draft=${draftid}`}>
              <ButtonIcon type="edit" tooltipText="edit" />
            </a>
            <ButtonIcon
              type="trash"
              onClick={() => onDelete(draftid)}
              tooltipText="delete"
            />
          </div>
        }
      />
    </div>
  );
}

export default DraftCard;
