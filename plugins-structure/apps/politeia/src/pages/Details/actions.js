import { createAction } from "@reduxjs/toolkit";

export const fetchProposalDetails = createAction(
  "details/fetchProposalDetails"
);

export const fetchCommentsTimestamps = createAction(
  "details/fetchCommentsTimestamps"
);
