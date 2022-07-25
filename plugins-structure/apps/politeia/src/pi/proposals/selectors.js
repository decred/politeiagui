import { records } from "@politeiagui/core/records";
import {
  decodeProposalUserMetadata,
  getRecordStatusChanges,
  getPublicStatusChangeMetadata,
} from "./utils";
import * as ctes from "../lib/constants";

// under-review/authorized: status change to record public (getPublicStatusChangeMetadata)
// voting: vote summary start block height
// active/rejected: vote summary end block height
// completed/closed: pi billing status changes

export function selectProposalStatusChangeByToken(state, { status, token }) {
  if (!status || !token) return null;
  const record = records.selectByToken(state, token);
  if (!record) return null;

  const userMetadata = decodeProposalUserMetadata(record.metadata);

  let statusChange;
  // if (isUnderReviewOrAuthorized(status)) {
  //   statusChange = getPublicStatusChangeMetadata(userMetadata);
  // } else  if (isVoting(status)) {}
}
