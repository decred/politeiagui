import React from "react";
import { useSelector } from "react-redux";
import { recordsDrafts } from "@politeiagui/core/records/drafts";
import UserDetails from "./Details";
import { ProposalDraft, ProposalsListEmpty } from "../../../components";
import { RecordsList } from "@politeiagui/common-ui";

function UserDrafts({ userid }) {
  const drafts = useSelector((state) =>
    recordsDrafts.selectByUser(state, userid)
  );

  return (
    <UserDetails>
      {drafts ? (
        <RecordsList inventory={Object.keys(drafts)} records={drafts}>
          {Object.entries(drafts)
            .sort(([_, a], [__, b]) => b.timestamp - a.timestamp)
            .map(([id, draft]) => (
              <ProposalDraft draftid={id} key={id} draft={draft} />
            ))}
        </RecordsList>
      ) : (
        <ProposalsListEmpty listName="drafts" />
      )}
    </UserDetails>
  );
}

export default UserDrafts;
