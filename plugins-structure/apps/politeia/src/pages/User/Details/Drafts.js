import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordsDrafts } from "@politeiagui/core/records/drafts";
import UserDetails from "./Details";
import { ProposalDraft, ProposalsListEmpty } from "../../../components";
import { RecordsList } from "@politeiagui/common-ui";
import isEmpty from "lodash/isEmpty";

function UserDrafts({ userid }) {
  const dispatch = useDispatch();
  const drafts = useSelector((state) =>
    recordsDrafts.selectByUser(state, userid)
  );
  function handleDelete(draftid) {
    dispatch(recordsDrafts.delete({ draftid, userid }));
  }
  return (
    <UserDetails>
      {!isEmpty(drafts) ? (
        <RecordsList inventory={Object.keys(drafts)} records={drafts}>
          {Object.entries(drafts)
            .sort(([_, a], [__, b]) => b.timestamp - a.timestamp)
            .map(([id, draft]) => (
              <ProposalDraft
                draftid={id}
                key={id}
                draft={draft}
                onDelete={handleDelete}
              />
            ))}
        </RecordsList>
      ) : (
        <ProposalsListEmpty listName="drafts" />
      )}
    </UserDetails>
  );
}

export default UserDrafts;
