import React from "react";
import { Event, Join, RecordCard } from "@politeiagui/common-ui";
import { decodeProposalDraftForm } from "../../pi/proposals/utils";
import { ProposalTitle } from "./common";
import { PROPOSAL_TYPE_RFP } from "../../pi";
import { Link, StatusTag } from "pi-ui";

function DraftCard({ draft, draftid }) {
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
            <Link data-link href={`/record/new?draft=${draftid}`}>
              edit draft
            </Link>
            <Event timestamp={draft.timestamp} />
          </Join>
        }
        rightHeader={<StatusTag text="Draft" type="blueTime" />}
      />
    </div>
  );
}

export default DraftCard;
