import React from "react";
import { RecordItem } from "@politeiagui/common-ui";
import { decodeProposalRecord } from "../../pi/proposals/utils";

export function ProposalsCompact({
  // title,
  records,
  // voteSummaries,
  // proposalSummaries,
  // commentsCounts,
}) {
  return (
    <div>
      {records.map((record, i) => {
        // const { name, author, token, userMetadata } =
        const { name } = decodeProposalRecord(record);
        return <RecordItem title={name} key={i} />;
      })}
    </div>
  );
}
