import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import {
  fetchProposalDetails,
  selectDetailsStatus,
  selectFullToken,
} from "./detailsSlice";
import ProposalDetails from "../../components/Proposal/ProposalDetails";

function Details({ token, isRaw }) {
  const dispatch = useDispatch();
  const fullToken = useSelector(selectFullToken);
  const record = useSelector((state) =>
    records.selectByToken(state, fullToken)
  );
  const voteSummary = useSelector((state) =>
    ticketvoteSummaries.selectByToken(state, fullToken)
  );
  const detailsStatus = useSelector(selectDetailsStatus);

  useEffect(() => {
    dispatch(fetchProposalDetails(token));
  }, [token, dispatch]);

  if (isRaw) {
    return JSON.stringify(record, null, 2);
  }

  return detailsStatus === "succeeded" ? (
    <div>
      <ProposalDetails record={record} voteSummary={voteSummary} />
    </div>
  ) : (
    "Loading..."
  );
}

export default Details;
